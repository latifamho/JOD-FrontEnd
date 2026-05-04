"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { RewardsTable } from "@/components/pages/rewards-management/rewards-table";
import { badgeStaticData, type BadgeItem } from "@/components/pages/rewards-management/static-data";
import {
  EMPTY_REWARD_FORM_VALUES,
  RewardFormSheet,
  type RewardFormValues,
} from "@/components/pages/rewards-management/reward-form-sheet";
import { createNextBadgeId } from "@/components/pages/rewards-management/helpers";
import { AppIcons } from "@/constant/icons";

export function RewardsManagementPage() {
  const [badges, setBadges] = React.useState<BadgeItem[]>(badgeStaticData);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<RewardFormValues>(EMPTY_REWARD_FORM_VALUES);
  const [editingBadgeId, setEditingBadgeId] = React.useState<string | null>(null);

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingBadgeId(null);
    setFormInitialValues(EMPTY_REWARD_FORM_VALUES);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback((rewardId: string) => {
    const badge = badges.find((candidate) => candidate.id === rewardId);
    if (!badge) {
      return;
    }

    setFormMode("edit");
    setEditingBadgeId(badge.id);
    setFormInitialValues({
      name: badge.name,
      description: badge.description,
      criteria: badge.criteria,
      iconName: badge.iconName,
      isActive: badge.isActive,
    });
    setFormOpen(true);
  }, [badges]);

  const handleSaveForm = React.useCallback((values: RewardFormValues) => {
    setBadges((currentBadges) => {
      if (formMode === "create") {
        const nextBadge: BadgeItem = {
          id: createNextBadgeId(currentBadges),
          name: values.name,
          description: values.description,
          criteria: values.criteria,
          iconName: values.iconName,
          isActive: values.isActive,
          createdAt: new Date().toISOString(),
        };

        return [nextBadge, ...currentBadges];
      }

      if (!editingBadgeId) {
        return currentBadges;
      }

      return currentBadges.map((badge) =>
        badge.id === editingBadgeId
          ? {
              ...badge,
              name: values.name,
              description: values.description,
              criteria: values.criteria,
              iconName: values.iconName,
              isActive: values.isActive,
            }
          : badge,
      );
    });
  }, [editingBadgeId, formMode]);

  const handleToggleRewardStatus = React.useCallback((rewardId: string) => {
    setBadges((currentBadges) =>
      currentBadges.map((badge) =>
        badge.id === rewardId ? { ...badge, isActive: !badge.isActive } : badge,
      ),
    );
  }, []);

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            إدارة الشارات والمكافآت
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {badges.length} شارة
          </p>
        </div>
        <Button size="sm" className="w-fit" onClick={openCreateSheet}>
          <AppIcons.rewards className="size-4" />
          إضافة شارة
        </Button>
      </div>

      {badges.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center">
          <p className="text-sm font-medium text-foreground">
            لا توجد شارات حتى الآن
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            أضف شارة جديدة من الزر أعلاه
          </p>
        </div>
      ) : (
        <RewardsTable
          rows={badges}
          onEditReward={openEditSheet}
          onToggleRewardStatus={handleToggleRewardStatus}
        />
      )}

      <RewardFormSheet
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        onOpenChange={setFormOpen}
        onSubmit={handleSaveForm}
      />
    </section>
  );
}
