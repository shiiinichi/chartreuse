import { AutocompleteScenarios } from './form-scenarios/AutocompleteExamples';
import { MessageComposerScenarios } from './form-scenarios/ComposerExamples';
import { FilePickerScenarios } from './form-scenarios/FileExamples';
import { CheckboxScenarios, SelectScenarios, SwitchScenarios } from './form-scenarios/Selections';
import { TextAreaScenarios, TextFieldScenarios } from './form-scenarios/TextFields';

export type FormScenarioName = 'TextField' | 'TextArea' | 'Select' | 'Checkbox' | 'Switch' | 'Autocomplete' | 'FilePicker' | 'MessageComposer';

/** Each supported form component has focused, independently switchable examples. */
export function FormScenarios({ name }: { name: FormScenarioName }) {
  switch (name) {
    case 'TextField': return <TextFieldScenarios />;
    case 'TextArea': return <TextAreaScenarios />;
    case 'Select': return <SelectScenarios />;
    case 'Checkbox': return <CheckboxScenarios />;
    case 'Switch': return <SwitchScenarios />;
    case 'Autocomplete': return <AutocompleteScenarios />;
    case 'FilePicker': return <FilePickerScenarios />;
    case 'MessageComposer': return <MessageComposerScenarios />;
  }
}
