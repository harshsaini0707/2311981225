import { Redis } from "@upstash/redis";
import { Log } from "logging_middleware";

const redis = Redis.fromEnv();
const EMAIL_QUEUE_KEY = "queue:email";
const PUSH_QUEUE_KEY = "queue:push";
const BATCH_SIZE = 100;
const WORKER_INTERVAL_MS = 2000;

interface NotificationJob {
  studentId: string;
  message: string;
}

export async function enqueueBulkJobs(studentIds: string[], message: string): Promise<void> {
  const jobs: NotificationJob[] = studentIds.map((studentId) => ({ studentId, message }));

  if (jobs.length === 0) {
    return;
  }

  await redis.lpush(EMAIL_QUEUE_KEY, ...jobs.map((job) => JSON.stringify(job)));
  await redis.lpush(PUSH_QUEUE_KEY, ...jobs.map((job) => JSON.stringify(job)));
  void Log("backend", "INFO", "queueService", `Queued ${jobs.length} jobs on Upstash`);
}

async function parseJob(raw: unknown): Promise<NotificationJob | null> {
  if (typeof raw !== "string") {
    return null;
  }
  try {
    return JSON.parse(raw) as NotificationJob;
  } catch {
    return null;
  }
}

async function processQueueBatch(queueKey: string, workerName: "emailWorker" | "pushWorker"): Promise<void> {
  for (let count = 0; count < BATCH_SIZE; count += 1) {
    const raw = await redis.rpop<string>(queueKey);
    if (!raw) {
      break;
    }
    const job = await parseJob(raw);
    if (!job) {
      void Log("backend", "WARN", workerName, `Dropped invalid payload from ${queueKey}`);
      continue;
    }
    void Log("backend", "INFO", workerName, `Processed job for ${job.studentId}`);
  }
}

export function startWorkers() {
  setInterval(() => {
    void processQueueBatch(EMAIL_QUEUE_KEY, "emailWorker");
  }, WORKER_INTERVAL_MS);
  setInterval(() => {
    void processQueueBatch(PUSH_QUEUE_KEY, "pushWorker");
  }, WORKER_INTERVAL_MS);
  void Log("backend", "INFO", "queueService", "Upstash queue workers started");
}
