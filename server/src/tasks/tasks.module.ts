import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [WorkspacesModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
