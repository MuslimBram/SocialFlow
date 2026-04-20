# Security Specification for SocialFlow

## Data Invariants
1. **Workspace Integrity**: Every social account, post, and log MUST belong to a valid Workspace.
2. **Access Control**: Users can only access data belonging to workspaces where they are a member.
3. **Immutable Fields**: `workspaceId`, `ownerId`, and `createdAt` cannot be changed after creation.
4. **Member roles**: Non-owners cannot delete a workspace.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Spoofing**: Attempt to create a workspace with someone else's UID as `ownerId`.
2. **Workspace Hijacking**: User A attempts to read User B's workspace settings.
3. **Cross-Tenant Write**: User A attempts to create a post in User B's workspace.
4. **Token Poisoning**: Attempt to store a 1MB string in `accessToken`.
5. **Unauthorized Status Change**: A non-workspace member attempts to change a post status to `published`.
6. **Date Forgery**: Attempt to set `createdAt` to a date in the past instead of `request.time`.
7. **Social Account Theft**: User A attempts to update the `accessToken` of User B's social account.
8. **Orphaned Post**: Attempt to create a post with a non-existent `workspaceId`.
9. **Role Escalation**: Attempt to change own role from `viewer` to `admin` in a workspace.
10. **Shadow Fields**: Attempt to add `isAdmin: true` to a social account document.
11. **Batch Integrity Violation**: Attempt to delete a post without deleting its associated `publishing_logs` (if atomicity required).
12. **Mass Deletion**: Unauthenticated user attempting to delete all posts.

## Protection Strategy
- **Master Gate**: Access to sub-resources (accounts, posts) is gated by verifying membership via the parent `workspace` document.
- **Validation Blueprints**: `isValidWorkspace`, `isValidPost`, `isValidSocialAccount` helpers.
- **Atomic Operations**: Using `get()` for relational sync.
