import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupsApi } from "../api/groups";
import { InlineNotice, PageTitle } from "../components/Ui";
import { errorMessage } from "../lib/errors";

interface FormState {
  name: string;
  description: string;
}

export function GroupCreatePage(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ name: "", description: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    if (!form.name.trim()) return "Name is required.";
    if (form.name.trim().length > 200) return "Name must be at most 200 characters.";
    if (form.description.length > 4000) return "Description must be at most 4000 characters.";
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const created = await groupsApi.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined
      });
      await navigate(`/groups/${created.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageTitle title="Create Group" subtitle="Create a place group to curate collections." />
      {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
      <form className="card form-grid" onSubmit={(e) => void onSubmit(e)}>
        <label className="field">
          <span>Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={200} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={4000}
          />
        </label>
        <div>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
}
