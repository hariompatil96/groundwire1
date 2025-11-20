
export const formTools = [
  {
    type: "heading",
    label: "Header",
    variant: "h1",
  },
  {
    type: "text",
    label: "Text Field",
    required: true,
    placeholder: "Enter your text here",
    value: ""
  },
  {
    type: "number",
    required: true,
    placeholder: "Enter your number here",
    label: "Number field",
    value: ""
  },
  {
    type: "file upload",
    required: false,
    label: "File Upload",
    multiple: false
  },
  {
    type: "button",
    label: "Button",
    style: "primary"
  },
  {
    type: "select",
    required: false,
    label: "Select",
    values: [
      {
        label: "Option 1",
        value: "option-1",
        selected: true
      },
      {
        label: "Option 2",
        value: "option-2",
        selected: false
      },
      {
        label: "Option 3",
        value: "option-3",
        selected: false
      }
    ]
  },
  {
    type: "checkbox group",
    required: false,
    label: "Checkbox Group",
    toggle: false,
    inline: false,
    name: "checkbox-group-1733839789339-0",
    access: false,
    other: false,
    values: [
      {
        label: "Option 1",
        value: "option-1",
        selected: true
      }
    ]
  },
  {
    type: "radio group",
    required: false,
    label: "Radio Group",
    values: [
      {
        label: "Option 1",
        value: "option-1",
        selected: false
      },
      {
        label: "Option 2",
        value: "option-2",
        selected: false
      },
      {
        label: "Option 3",
        value: "option-3",
        selected: false
      }
    ]
  },
  {
    "type": "paragraph",
    "label": "Paragraph",
  },
  {
    type: "textarea",
    required: false,
    label: "Text Area",
    placeholder: "enter here",
    value: ""
  },
]