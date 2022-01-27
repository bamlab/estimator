import React from "react";
import { InlineInput } from "./styles/Base";
import autosize from "autosize";

type Props = {
  onSave: (value: string) => void;
  border?: boolean;
  placeholder: string;
  value: string;
  autoFocus?: boolean;
  resize?: "none" | "vertical" | "horizontal";
};

class InlineInputController extends React.Component<Props> {
  refInput: React.LegacyRef<HTMLTextAreaElement>;
  onFocus = (e) => e.target.select();

  // This is the way to select all text if mouse clicked
  onMouseDown = (e) => {
    if (document.activeElement != e.target) {
      e.preventDefault();
      this.refInput.focus();
    }
  };

  onBlur = () => {
    this.updateValue();
  };

  onKeyDown = (e) => {
    if (e.keyCode == 13) {
      this.refInput.blur();
      e.preventDefault();
    }
    if (e.keyCode == 27) {
      this.setValue(this.props.value);
      this.refInput.blur();
      e.preventDefault();
    }
    if (e.keyCode == 9) {
      if (this.getValue().length == 0) {
        this.props.onCancel();
      }
      this.refInput.blur();
      e.preventDefault();
    }
  };

  getValue = () => this.refInput.value;
  setValue = (value: string) => (this.refInput.value = value);

  updateValue = () => {
    if (this.getValue() != this.props.value) {
      this.props.onSave(this.getValue());
    }
  };

  setRef = (ref: React.LegacyRef<HTMLTextAreaElement>) => {
    this.refInput = ref;
    if (this.props.resize != "none") {
      autosize(this.refInput);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setValue(nextProps.value);
  }

  render() {
    const {
      autoFocus = false,
      border = false,
      value = "",
      placeholder = "",
    } = this.props;

    return (
      <InlineInput
        ref={this.setRef}
        border={border}
        onMouseDown={this.onMouseDown}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        placeholder={value.length == 0 ? undefined : placeholder}
        defaultValue={value}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        dataGramm="false"
        rows={1}
        autoFocus={autoFocus}
      />
    );
  }
}

export default InlineInputController;
