export interface FormFieldProps {
	label: string
	name: string
	required?: boolean
	type?: 'text' | 'email' | 'tel' | 'textarea' | 'select'
	placeholder?: string
	options?: string[]
	validation?: any
  }
  
  export interface FormSectionProps {
	title: string
	description?: string
	fields: FormFieldProps[]
	onSubmit: (data: any) => void
	defaultValues?: any
  }