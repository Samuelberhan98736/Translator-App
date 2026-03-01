"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import type { TranslateInput } from "@/features/translate/types";

type Props = {
  input: TranslateInput;
  onChange: (next: TranslateInput) => void;
};

export default function JobInputPanel({ input, onChange }: Props) {
  function update(field: keyof TranslateInput, value: string) {
    onChange({ ...input, [field]: value });
  }

  function importHandshake() {
    if (input.handshakeTitle?.trim()) {
      update("jobTitle", input.handshakeTitle.trim());
    }

    if (input.handshakeDescription?.trim()) {
      update("jobDescription", input.handshakeDescription.trim());
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-900">Job Input Panel</h2>

      <label className="text-sm font-semibold text-slate-700" htmlFor="jobTitle">
        Desired Job Title
      </label>
      <Input
        id="jobTitle"
        value={input.jobTitle}
        onChange={(event) => update("jobTitle", event.target.value)}
        placeholder="e.g. FinTech Analyst"
      />

      <label
        className="text-sm font-semibold text-slate-700"
        htmlFor="jobDescription"
      >
        Desired Job Description
      </label>
      <Textarea
        id="jobDescription"
        rows={6}
        value={input.jobDescription}
        onChange={(event) => update("jobDescription", event.target.value)}
        placeholder="Paste target job description"
      />

      <label className="text-sm font-semibold text-slate-700" htmlFor="handshakeUrl">
        Handshake URL
      </label>
      <Input
        id="handshakeUrl"
        value={input.handshakeUrl ?? ""}
        onChange={(event) => update("handshakeUrl", event.target.value)}
        placeholder="https://app.joinhandshake.com/..."
      />

      <label
        className="text-sm font-semibold text-slate-700"
        htmlFor="handshakeTitle"
      >
        Handshake Title
      </label>
      <Input
        id="handshakeTitle"
        value={input.handshakeTitle ?? ""}
        onChange={(event) => update("handshakeTitle", event.target.value)}
      />

      <label
        className="text-sm font-semibold text-slate-700"
        htmlFor="handshakeDescription"
      >
        Handshake Description
      </label>
      <Textarea
        id="handshakeDescription"
        rows={4}
        value={input.handshakeDescription ?? ""}
        onChange={(event) => update("handshakeDescription", event.target.value)}
      />

      <Button variant="secondary" onClick={importHandshake}>
        Use Handshake Fields
      </Button>
    </Card>
  );
}
