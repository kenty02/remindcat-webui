import { setupServer } from "msw/node";
import { getDefaultMSW } from "@/api/default/default.msw";

export const server = setupServer(...getDefaultMSW());
