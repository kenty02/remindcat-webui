import { setupWorker } from "msw";
import { getDefaultMSW } from "@/api/default/default.msw";

export const worker = setupWorker(...getDefaultMSW());
