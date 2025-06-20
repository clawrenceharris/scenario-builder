import { useState } from "react";
import { useToast } from "../../context";
import type { SignUpFormValues } from "../../types";
import { updateUserInterests } from "../../services/interests";
import { updateUserGoals } from "../../services/user";
import { useSignUp } from "../../hooks";
import type { User } from "@supabase/supabase-js";

interface EditProfileProps {
  onSubmit: () => void;
  user: User;
}
const NUM_STEPS = 3;
const EditProfile = ({ onSubmit, user }: EditProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const { renderStep, step } = useSignUp({
    handleSubmit: (data: Partial<SignUpFormValues>) => handleSubmit(data),
    error,
    stepStart: 2,
    stepEnd: NUM_STEPS,
    isLoading,
  });

  const handleSubmit = async (data: Partial<SignUpFormValues>) => {
    try {
      if (step < NUM_STEPS) {
        return;
      }
      if (!user) {
        throw Error("User could not be found");
      }
      setIsLoading(true);

      await updateUserInterests(user.id, data.interests || []);

      await updateUserGoals(user.id, data.goals || []);

      showToast("Profile updated successfully!", { type: "success" });
      onSubmit();
    } catch {
      setError("Something went wrong. Please try again later.");
      showToast("Could not update profile.", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  return <>{renderStep()}</>;
};

export default EditProfile;
