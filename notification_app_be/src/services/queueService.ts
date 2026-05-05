import { Queue, Worker, Job } from "bullmq";
import { Log } from "logging_middleware";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("email_queue", { connection });
export const pushQueue = new Queue("push_queue", { connection });

interface NotificationJob {
  studentId: string;
  message: string;
}

export async function enqueueBulkJobs(studentIds: string[], message: string): Promise<void> {
  const jobs = studentIds.map((studentId) => ({
    name: `student-${studentId}`,
    data: { studentId, message },
  }));

  await emailQueue.addBulk(jobs);
  await pushQueue.addBulk(jobs);
  void Log("backend", "INFO", "queueService", `Queued ${jobs.length} email and push jobs`);
}

async function emailProcessor(job: Job<NotificationJob>) {
  void Log("backend", "INFO", "emailWorker", `Email sent to ${job.data.studentId}`);
}

async function pushProcessor(job: Job<NotificationJob>) {
  void Log("backend", "INFO", "pushWorker", `Push sent to ${job.data.studentId}`);
}

export function startWorkers() {
  new Worker("email_queue", emailProcessor, { connection });
  new Worker("push_queue", pushProcessor, { connection });
  void Log("backend", "INFO", "queueService", "Queue workers started");
}
