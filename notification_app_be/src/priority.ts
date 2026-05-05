import "dotenv/config";
import axios from "axios";
import { Log } from "logging_middleware";
import { getTopN } from "./services/priorityService";

async function main() {
  void Log("backend", "INFO", "priority-script", "Fetching notifications from external API");

  const baseURL = process.env.EXTERNAL_API_BASE ?? "http://20.207.122.201/evaluation-service";
  const apiKey = process.env.EXTERNAL_API_KEY ?? "";

  const { data } = await axios.get(`${baseURL}/notifications`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const top10 = getTopN(data.notifications ?? [], 10);
  void Log("backend", "INFO", "priority-script", "Top 10 computed successfully");
  console.table(
    top10.map((notification: { Type: string; Message: string; Timestamp: string }, index: number) => ({
      Rank: index + 1,
      Type: notification.Type,
      Message: notification.Message,
      Timestamp: notification.Timestamp,
    }))
  );
}

void main();
