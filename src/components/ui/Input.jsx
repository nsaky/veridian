export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    className = '',
    ...props
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-text-head text-sm font-medium">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-bg-input text-text-body px-4 py-3 rounded-lg border border-white/10 focus:border-veridian-neon focus:outline-none transition-colors"
                {...props}
            />
        </div>
    )
}
