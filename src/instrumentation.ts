export async function register() {
  // Node runtime only -- the scheduler uses `pg`, which isn't available in the Edge
  // runtime instrumentation can also run under.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startValeReportScheduler } = await import("./lib/valeReportScheduler");
    startValeReportScheduler();
  }
}
