import { defineBackend } from "@aws-amplify/backend";
import { trimmerFunction } from "./functions/trimmer/resource";
export default defineBackend({
  trimmerFunction,
});
