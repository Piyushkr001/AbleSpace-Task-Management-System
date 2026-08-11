"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FieldVisibility } from "../types/task.types";

interface TaskFieldsPopoverProps {
  fields: FieldVisibility;
  onChange: (fields: FieldVisibility) => void;
}

export function TaskFieldsPopover({ fields, onChange }: TaskFieldsPopoverProps) {
  const toggleField = (key: keyof FieldVisibility) => {
    onChange({
      ...fields,
      [key]: !fields[key],
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl px-3 border-border/80 text-xs font-medium"
          />
        }
      >
        <Settings2 className="size-3.5 mr-1.5 text-muted-foreground" />
        <span>Fields</span>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-48 p-3 shadow-md rounded-xl">
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-foreground px-1 pb-1">
            Toggle Fields
          </h4>
          <Separator className="my-1.5" />

          <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent text-xs cursor-pointer select-none">
            <Checkbox
              checked={fields.priority}
              onCheckedChange={() => toggleField("priority")}
            />
            <span>Priority</span>
          </label>

          <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent text-xs cursor-pointer select-none">
            <Checkbox
              checked={fields.members}
              onCheckedChange={() => toggleField("members")}
            />
            <span>Members</span>
          </label>

          <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent text-xs cursor-pointer select-none">
            <Checkbox
              checked={fields.dates}
              onCheckedChange={() => toggleField("dates")}
            />
            <span>Due Date</span>
          </label>

          <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent text-xs cursor-pointer select-none">
            <Checkbox
              checked={fields.labels}
              onCheckedChange={() => toggleField("labels")}
            />
            <span>Labels</span>
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
