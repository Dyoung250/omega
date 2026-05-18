import { create } from "zustand";

export type OnboardingStep =
  | "welcome"
  | "library"
  | "macro"
  | "viewport"
  | "properties"
  | "materials"
  | "hdri"
  | "export"
  | "quote"
  | "preview"
  | "done";

interface OnboardingState {
  show: boolean;
  step: OnboardingStep;
  completed: boolean;
  setShow: (show: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  skip: () => void;
  restart: () => void;
}

const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "library",
  "macro",
  "viewport",
  "properties",
  "materials",
  "hdri",
  "export",
  "quote",
  "preview",
  "done",
];

function getNext(step: OnboardingStep): OnboardingStep {
  const i = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)];
}

function getPrev(step: OnboardingStep): OnboardingStep {
  const i = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.max(i - 1, 0)];
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  show: !localStorage.getItem("forgia_onboarding_done"),
  step: "welcome",
  completed: !!localStorage.getItem("forgia_onboarding_done"),

  setShow(show) {
    set({ show });
  },

  nextStep() {
    set((s) => {
      const next = getNext(s.step);
      if (next === "done") {
        localStorage.setItem("forgia_onboarding_done", "1");
        return { step: next, completed: true, show: false };
      }
      return { step: next };
    });
  },

  prevStep() {
    set((s) => ({ step: getPrev(s.step) }));
  },

  skip() {
    localStorage.setItem("forgia_onboarding_done", "1");
    set({ show: false, completed: true, step: "done" });
  },

  restart() {
    localStorage.removeItem("forgia_onboarding_done");
    set({ show: true, step: "welcome", completed: false });
  },
}));
