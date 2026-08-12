import { Controller, Get, UseGuards } from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { UnifiedAuthGuard } from "../auth/guards/unified-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "../auth/decorators/current-user.decorator";

@Controller("workspaces")
@UseGuards(UnifiedAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get("me/members")
  async getMembersMe(@CurrentUser() user: CurrentUserData) {
    return this.workspacesService.getWorkspaceMembersForUser(user.id);
  }
}
