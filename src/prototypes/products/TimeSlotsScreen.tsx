import { ProductLayout, SectionCard, Select } from './ProductLayout'
import { Checkbox } from '@ds/shared/Checkbox'
import { useProductState, productActions, WEEKDAYS } from './productStore'
import { PlusIcon, TrashIcon } from '@ds/icons/Icons'

function ReservationTimeSlots() {
  const { timeSlotsByDay } = useProductState()

  return (
    <div className="flex flex-col gap-3">
      {WEEKDAYS.map((day) => {
        const slots = timeSlotsByDay[day]
        return (
          <div key={day} className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white px-4 py-3">
            <div className="flex items-center justify-between gap-vintiga-md">
              <span className="typo-body-sm font-semibold text-vintiga-slate-900">{day}</span>
              <button
                type="button"
                onClick={() => productActions.addTimeSlot(day)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add Time
              </button>
            </div>
            {slots.length > 0 && (
              <div className="flex flex-col gap-2 pt-3">
                {slots.map((s) => (
                  <div key={s.id} className="grid grid-cols-[120px_120px_1fr_24px] items-center gap-3">
                    <input
                      type="text"
                      placeholder="9:00"
                      value={s.time}
                      onChange={(e) => productActions.updateTimeSlot(day, s.id, { time: e.target.value })}
                      className="h-10 w-full px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                      aria-label={`Time for ${day}`}
                    />
                    <Select
                      value={s.period}
                      onChange={(v) => productActions.updateTimeSlot(day, s.id, { period: v as 'AM' | 'PM' })}
                      options={['AM', 'PM']}
                    />
                    <Checkbox
                      checked={s.online}
                      onChange={(next) => productActions.updateTimeSlot(day, s.id, { online: next })}
                      label="Online"
                    />
                    <button
                      type="button"
                      onClick={() => productActions.removeTimeSlot(day, s.id)}
                      className="w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-red-600 bg-transparent border-none cursor-pointer"
                      aria-label={`Remove time slot from ${day}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function TimeSlotsScreen() {
  return (
    <ProductLayout activeTab="timeslots">
      <SectionCard title="Reservation Time Slots">
        <p className="typo-body-sm text-vintiga-slate-500">
          Set the bookable times for each weekday. Untoggle Online to keep a slot phone-only.
        </p>
        <ReservationTimeSlots />
      </SectionCard>
    </ProductLayout>
  )
}
