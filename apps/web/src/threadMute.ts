import { scopedThreadKey } from "@t3tools/client-runtime/environment";
import type { EnvironmentId, ScopedThreadRef, ThreadId } from "@t3tools/contracts";
import type { ClientSettings } from "@t3tools/contracts/settings";

import { persistClientSettingsUpdate, useClientSettings } from "./hooks/useSettings";

type MutedThreadSettings = Pick<ClientSettings, "mutedThreadKeys">;

export function isThreadMuted(
  settings: MutedThreadSettings,
  thread: { readonly environmentId: EnvironmentId; readonly id: ThreadId },
): boolean {
  if (settings.mutedThreadKeys.length === 0) return false;
  return settings.mutedThreadKeys.includes(
    scopedThreadKey({ environmentId: thread.environmentId, threadId: thread.id }),
  );
}

export function useThreadMuted(ref: ScopedThreadRef | null): boolean {
  return useClientSettings(
    (settings) => ref !== null && settings.mutedThreadKeys.includes(scopedThreadKey(ref)),
  );
}

export function setThreadMuted(ref: ScopedThreadRef, muted: boolean): Promise<ClientSettings> {
  const key = scopedThreadKey(ref);
  return persistClientSettingsUpdate((current) => {
    const without = current.mutedThreadKeys.filter((candidate) => candidate !== key);
    return { ...current, mutedThreadKeys: muted ? [...without, key] : without };
  });
}
