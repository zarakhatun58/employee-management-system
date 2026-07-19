
import api from "../services/api";
import type {
    OrganizationResponse,
  TreeNode,
} from "../types";

export const organizationService = {
  async getTree(): Promise<TreeNode[]> {
    const { data } =
      await api.get<OrganizationResponse>(
        "/organization/tree"
      );

    return data.data;
  },
};