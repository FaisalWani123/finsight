"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Shadcn imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { checkUsernameAvailabilityFromClient, onboardUser } from "@/app/backend/user/clientActions";
import { OnBoardUserRequest } from "@/app/backend/types/User";
import toast from "react-hot-toast";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

// Simulate city API
interface OnboardingPageProps {
  userId: string;
  email: string;
}
const usernameRegex = /^[a-zA-Z0-9_]+$/; // alphanumeric + underscores
const nameRegex = /^[A-Za-z]+$/; // only letters

export default function OnboardingPageClient({ userId, email }: OnboardingPageProps) {
  const router = useRouter();


  // Step state
  const [step, setStep] = useState(0);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showCelebration, setShowCelebration] = useState(false);


  // Errors
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);

  // Check username availability
  useEffect(() => {
    if (!username || !usernameRegex.test(username)) {
      setUsernameError(null);
      return;
    }

    const timer = setTimeout(async () => {
      const usernameResponse = await checkUsernameAvailabilityFromClient(username);
      const available = usernameResponse.data;
      setUsernameError(available ? null : "This username is already taken");
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Steps
  const steps = [
    {
      label: "First Name",
      render: () => (
        <>
          <Label>First Name</Label>
          <Input
            value={firstName}
            maxLength={12}
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameError(null);
            }}
            required
            className={firstNameError ? "border-red-500" : ""}
          />
          {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
        </>
      ),
    },
    {
      label: "Last Name",
      render: () => (
        <>
          <Label>Last Name</Label>
          <Input
            value={lastName}
            maxLength={12}
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameError(null);
            }}
            required
            className={lastNameError ? "border-red-500" : ""}
          />
          {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
        </>
      ),
    },
    {
      label: "Username",
      render: () => (
        <>
          <Label>Username</Label>
          <Input
            value={username}
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={usernameError ? "border-red-500" : ""}
          />
          {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
        </>
      ),
    },
    {
      label: "Age",
      render: () => (
        <>
          <Label>Age</Label>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={age === 0 ? "" : age}
            onChange={(e) => {
              const val = e.target.value;
              // allow only digits
              if (/^\d*$/.test(val)) {
                setAge(val === "" ? 0 : Number(val));
              }
            }}
            required
          />
          {ageError && <p className="text-red-500 text-sm">{ageError}</p>}
        </>
      ),
    },
    {
      label: "Gender",
      render: () => (
        <>
          <Label>Gender</Label>
          <Select value={gender} onValueChange={(val: "male" | "female") => setGender(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </>
      ),
    },
  ];

  // Next/Back
  const handleNext = () => {
    if (step === 0 && !nameRegex.test(firstName)) {
      setFirstNameError("Only letters are allowed");
      return;
    }
    if (step === 1 && !nameRegex.test(lastName)) {
      setLastNameError("Only letters are allowed");
      return;
    }
    if (step === 2) {
      if (!usernameRegex.test(username)) {
        setUsernameError("Only letters, numbers, and underscores allowed");
        return;
      }
      if (usernameError) return;
    }
    if (step === 3 && age && (age > 99 || age < 16)) {
      
      // const parsedAge = parseInt(age, 10)
      if (age < 16) {
        setAgeError("You must be atleast 16 to sign up");
        return
      }
      setAgeError("Congratulations on making it to triple digits, please stay at home - we cap out at 99")
      return; // must be valid age
    }

    if (step < steps.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Submit
  const handleSubmit = async () => {
    if (!userId) return;

    const onboardUserRequest: OnBoardUserRequest = {
      userId: userId, 
      email: email,
      firstName: firstName,
      lastName: lastName, 
      username: username,
      age: age,
      isMale: gender === "male",
    }
    const onboardUserResponse = await onboardUser(onboardUserRequest)
    if (!onboardUserResponse.success) {
        console.log("onboardUser Response: ", onboardUserResponse.success)
      return toast("Error completing profile, please try again later"); 
    } 

    setShowCelebration(true);
    // Hide the celebration animation after 2 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 2000);

    toast.success("Sign Up Complete!")
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className={`pt-2`}>Complete Your Profile</h1>
      <div className="p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6">
        <Progress value={((step + 1) / steps.length) * 100} className="h-2 rounded-full" />
        <div className="flex flex-col gap-4 mt-6">{steps[step].render()}</div>
        <div className="flex justify-between mt-6 gap-8">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>
            Back
          </Button>
          <Button onClick={handleNext}>{step === steps.length - 1 ? "Finish" : "Next"}</Button>
        </div>
      </div>
      {showCelebration && (
          <Fireworks autorun={{speed: 3, duration: 3}}/>
        )}
    </div>
  );
}