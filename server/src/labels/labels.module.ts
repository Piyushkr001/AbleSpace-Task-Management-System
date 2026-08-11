import { Module } from "@nestjs/common";
import { LabelsService } from "./labels.service";
import { LabelsController } from "./labels.controller";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [WorkspacesModule, AuthModule],
  controllers: [LabelsController],
  providers: [LabelsService],
  exports: [LabelsService],
})
export class LabelsModule {}
