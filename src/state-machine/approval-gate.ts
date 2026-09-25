/**
 * ADS INTELLIGENCE — Approval Gate State Machine
 * Enforces mandatory human approval flow and valid state transitions.
 */

import { CampaignState } from '../types/ads-intelligence';

export const VALID_TRANSITIONS: Record<CampaignState, CampaignState[]> = {
  DRAFT: ['ANALYZING', 'REJECTED'],
  ANALYZING: ['RECOMMENDED', 'DRAFT', 'REJECTED', 'PENDING_AUDIT'],
  PENDING_AUDIT: ['READY_FOR_REVIEW', 'CHANGES_REQUESTED', 'REJECTED'],
  RECOMMENDED: ['WAITING_CREATIVE', 'READY_FOR_REVIEW', 'CHANGES_REQUESTED', 'REJECTED'],
  WAITING_CREATIVE: ['READY_FOR_REVIEW', 'CHANGES_REQUESTED', 'REJECTED'],
  READY_FOR_REVIEW: ['APPROVED', 'CHANGES_REQUESTED', 'REJECTED'],
  CHANGES_REQUESTED: ['ANALYZING', 'RECOMMENDED', 'DRAFT'],
  APPROVED: ['PUBLISHED', 'PAUSED', 'REJECTED'],
  REJECTED: ['DRAFT'],
  PUBLISHED: ['PAUSED', 'COMPLETED'],
  PAUSED: ['PUBLISHED', 'COMPLETED', 'DRAFT'],
  COMPLETED: ['DRAFT']
};

export class ApprovalGate {
  /**
   * Validates if a state transition is allowed according to the governance rules.
   */
  public static canTransition(currentState: CampaignState, targetState: CampaignState): boolean {
    const allowed = VALID_TRANSITIONS[currentState] || [];
    return allowed.includes(targetState);
  }

  /**
   * Transitions a campaign state if valid, or throws an error.
   */
  public static transition(currentState: CampaignState, targetState: CampaignState, actor: string): CampaignState {
    if (!this.canTransition(currentState, targetState)) {
      throw new Error(
        `[ApprovalGate Violation] Transição inválida de '${currentState}' para '${targetState}' tentada por '${actor}'.`
      );
    }
    return targetState;
  }

  /**
   * Checks if a state requires human approval intervention.
   */
  public static requiresHumanReview(state: CampaignState): boolean {
    return state === 'READY_FOR_REVIEW' || state === 'PENDING_AUDIT';
  }

  /**
   * Checks if publishing is permitted.
   */
  public static isPublishAllowed(state: CampaignState): boolean {
    return state === 'APPROVED';
  }
}
