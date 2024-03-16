import { ENDPOINTS } from "common/endpoints";
import request from "services";

export const getConnectionHealth = () =>
  request().get(ENDPOINTS.CONNECTION_HEALTH);
