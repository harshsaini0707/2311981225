export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

const LOG_ENDPOINT =
  process.env.LOG_ENDPOINT ??
  "http://20.244.56.144/evaluation-service/logs";

interface LogPayload {
  stack: string;
  level: LogLevel;
  package: string;
  message: string;
}

export async function Log(
  stack: string,
  level: LogLevel,
  pkg: string,
  message: string
): Promise<void> {
  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Logging must never interrupt the primary flow.
  }
}
