import { ref } from "vue";

export enum FormStep {
  Start,
  Submitting,
  End,
}

export const useFormUtils = <T>(initialValues: T) => {
  const formValues = ref<T>(initialValues);

  const step = ref<FormStep>(FormStep.Start);

  const isStart = () => step.value === FormStep.Start;
  const isSubmitting = () => step.value === FormStep.Submitting;
  const isEnd = () => step.value === FormStep.End;

  const setStepStart = () => {
    step.value = FormStep.Start;
  };

  const setStepSubmitting = () => {
    step.value = FormStep.Submitting;
  };

  const setStepEnd = () => {
    step.value = FormStep.End;
  };

  const saveFormValues = (values: T) => {
    formValues.value = values;
  };

  const resetFormValues = () => {
    formValues.value = initialValues;
  };

  return {
    formValues,
    step,
    isStart,
    isSubmitting,
    isEnd,
    setStepStart,
    setStepSubmitting,
    setStepEnd,
    saveFormValues,
    resetFormValues,
  };
};
