import { ValueToken, DurationToken, TimeToken, type ValueKind } from "./temporax/tokens"
import { duration_suffix_to_mult, duration_unit_to_display, trim_float, type DurationUnit } from "./temporax/utils"

export type FormatConfig = {
	time_hr: "12" | "24",
}

export const formatters: {
	[K in ValueKind]: (t: ValueToken, config: FormatConfig)=> string
} = {
	date(t, config): string {
		const DAY = duration_suffix_to_mult["DAY"]
		const day_remainder = ((t.value % DAY) + DAY) % DAY
		const time_string = day_remainder === 0 ? "" : this.time(new TimeToken(day_remainder), config)

		const date = new Date(t.value)
		const year = date.getUTCFullYear()
		const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
		const day = date.getUTCDate().toString().padStart(2, "0")

		return `${year}_${month}_${day} ${time_string}`
	},
	time(t, config): string {
		const DAY = duration_suffix_to_mult["DAY"]
		const HOUR = duration_suffix_to_mult["HOUR"]
		const MINUTE = duration_suffix_to_mult["MINUTE"]
		const SECOND = duration_suffix_to_mult["SECOND"]

		const day_offset = Math.floor(t.value / DAY)
		const remainder = ((t.value % DAY) + DAY) % DAY
		const hours = Math.floor(remainder / HOUR)
		const minutes = Math.floor((remainder % HOUR) / MINUTE)
		const seconds = Math.floor((remainder % MINUTE) / SECOND)
		const millis = remainder % SECOND

		let display_hours = hours
		let ampm = ""
		if (config.time_hr === "12") {
			const wrapped = hours % 12
			display_hours = wrapped === 0 ? 12 : wrapped
			ampm = hours < 12 ? "am" : "pm"
		}

		const fraction = millis > 0 ? `.${Math.trunc(millis)}` : ""
		const time_string = (
			`${(display_hours).toString().padStart(config.time_hr === "24" ? 2 : 1, "0")}:`
			+ `${minutes.toString().padStart(2, "0")}:`
			+ `${seconds.toString().padStart(2, "0")}${fraction}${ampm}`
		)

		if (day_offset === 0) {
			return time_string
		}

		const abs_days = Math.abs(day_offset)
		const day_label = abs_days === 1 ? "day" : "days"
		const sign = day_offset > 0 ? "+" : "-"
		return `${time_string} (${sign}${abs_days} ${day_label})`
	},
	duration(t): string {
		let remaining = t.value
		if (remaining === 0) return "0ms"
		const sign = remaining < 0 ? "-" : ""
		remaining = Math.abs(remaining)
		const parts: string[] = []
		let i = 0
		for (const [unit, mult] of DurationToken.sorted_duration_units) {
			const is_last = i === DurationToken.sorted_duration_units.length - 1
			i += 1
			if (remaining < mult && !is_last) continue
			if (is_last) {
				const amount = remaining / mult
				if (amount !== 0) {
					parts.push(`${trim_float(amount)}${duration_unit_to_display[unit]}`)
				}
				break
			}
			const whole = Math.floor(remaining / mult)
			if (whole > 0) {
				parts.push(`${whole}${duration_unit_to_display[unit]}`)
				remaining -= whole * mult
			}
		}
		return sign + parts.join(" ")
	},
	num(t): string {
		return trim_float(t.value)
	},
}
