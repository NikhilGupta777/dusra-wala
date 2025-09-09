import { defineFunction } from "@aws-amplify/backend";
import { Duration, Size, CfnOutput } from "aws-cdk-lib";
import { Code, FunctionUrlAuthType, Runtime, Function, LayerVersion, Architecture } from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
const __dirnameLocal = path.dirname(fileURLToPath(import.meta.url));

export const trimmerFunction = defineFunction((scope) => {
  // TODO: Replace with an FFmpeg layer ARN that exists in your AWS region:
  // e.g., ap-south-1 / us-east-1 / etc.
  const ffmpegLayerArn = process.env.FFMPEG_LAYER_ARN ?? "arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:21";
  const ffmpegLayer = LayerVersion.fromLayerVersionArn(scope, "FfmpegLayer", ffmpegLayerArn);

  const func = new Function(scope, "flask-trimmer", {
    runtime: Runtime.PYTHON_3_11,
    architecture: Architecture.X86_64,
    handler: "handler.handler", // uses awsgi to adapt Flask app to Lambda
    code: Code.fromAsset(__dirnameLocal, { exclude: ["resource.ts"] }),
    timeout: Duration.minutes(10),
    memorySize: 3072,
    ephemeralStorageSize: Size.mebibytes(4096),
    environment: {
      HOST: "0.0.0.0",
      PORT: "8000",          // used only for local run of app.py; Lambda uses handler()
      KEEP_HOURS: "24",
      MAX_TRIM_SECONDS: String(60 * 60),
      MAX_CONCURRENT_JOBS: "2",
    },
    layers: [ffmpegLayer],
  });

  const url = func.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
    cors: { allowedOrigins: ["*"], allowedMethods: ["GET", "POST"] },
  });

  new CfnOutput(scope, "FunctionUrl", { value: url.url });
  return func;
});
