import { ProductLayout, SectionCard, Field, Select, TextInput } from './ProductLayout'
import { Checkbox } from '@ds/shared/Checkbox'
import { useProductState, productActions, WEEKDAYS, type Blackout } from './productStore'
import { PlusIcon, TrashIcon } from '@ds/icons/Icons'

function RecurringSchedule() {
  const { scheduleRepeatsUntil } = useProductState()
  const mode: 'indefinitely' | 'until' = scheduleRepeatsUntil ? 'until' : 'indefinitely'

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Repeats" helper="How long this weekly schedule stays active.">
        <Select
          value={mode === 'until' ? 'Until date' : 'Indefinitely'}
          onChange={(v) =>
            productActions.setScheduleRepeatsUntil(
              v === 'Indefinitely' ? '' : scheduleRepeatsUntil || new Date().toISOString().slice(0, 10),
            )
          }
          options={['Indefinitely', 'Until date']}
        />
      </Field>
      {mode === 'until' && (
        <Field label="Stop date" helper="After this date you'll need to set up a new schedule.">
          <TextInput
            type="date"
            value={scheduleRepeatsUntil}
            onChange={(e) => productActions.setScheduleRepeatsUntil(e.target.value)}
          />
        </Field>
      )}
    </div>
  )
}

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
                      label="Display on website"
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

function BlackoutCard({ b, index }: { b: Blackout; index: number }) {
  return (
    <div className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-vintiga-md">
        <span className="typo-body-sm font-semibold text-vintiga-slate-900">Blackout {index + 1}</span>
        <button
          type="button"
          onClick={() => productActions.removeBlackout(b.id)}
          className="w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-red-600 bg-transparent border-none cursor-pointer"
          aria-label="Remove blackout"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date">
          <TextInput
            type="date"
            value={b.startDate}
            onChange={(e) => productActions.updateBlackout(b.id, { startDate: e.target.value })}
          />
        </Field>
        <Field label="End date" helper="Leave empty for a single day.">
          <TextInput
            type="date"
            value={b.endDate}
            onChange={(e) => productActions.updateBlackout(b.id, { endDate: e.target.value })}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start time" helper="Leave empty to block the whole day.">
          <div className="grid grid-cols-[1fr_80px] gap-2">
            <TextInput
              type="text"
              placeholder="All day"
              value={b.startTime}
              onChange={(e) => productActions.updateBlackout(b.id, { startTime: e.target.value })}
            />
            <Select
              value={b.startPeriod}
              onChange={(v) => productActions.updateBlackout(b.id, { startPeriod: v as 'AM' | 'PM' })}
              options={['AM', 'PM']}
            />
          </div>
        </Field>
        <Field label="End time">
          <div className="grid grid-cols-[1fr_80px] gap-2">
            <TextInput
              type="text"
              placeholder="All day"
              value={b.endTime}
              onChange={(e) => productActions.updateBlackout(b.id, { endTime: e.target.value })}
            />
            <Select
              value={b.endPeriod}
              onChange={(v) => productActions.updateBlackout(b.id, { endPeriod: v as 'AM' | 'PM' })}
              options={['AM', 'PM']}
            />
          </div>
        </Field>
      </div>
    </div>
  )
}

function BlackoutDates() {
  const { blackouts } = useProductState()

  return (
    <div className="flex flex-col gap-3">
      {blackouts.length === 0 ? (
        <p className="typo-body-sm text-vintiga-slate-500">No blackout dates yet. Add one for closures, private events, or holidays.</p>
      ) : (
        blackouts.map((b, i) => <BlackoutCard key={b.id} b={b} index={i} />)
      )}
      <div>
        <button
          type="button"
          onClick={() => productActions.addBlackout()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Blackout Date
        </button>
      </div>
    </div>
  )
}

export function TimeSlotsScreen() {
  return (
    <ProductLayout activeTab="timeslots">
      <SectionCard title="Recurring schedule">
        <p className="typo-body-sm text-vintiga-slate-500">
          This weekly schedule applies to every week — set a stop date if you want it to expire.
        </p>
        <RecurringSchedule />
      </SectionCard>

      <SectionCard title="Weekly schedule">
        <p className="typo-body-sm text-vintiga-slate-500">
          Set the bookable times for each weekday. Untick Display on website to keep a slot phone-only.
        </p>
        <ReservationTimeSlots />
      </SectionCard>

      <SectionCard title="Blackout dates">
        <p className="typo-body-sm text-vintiga-slate-500">
          Block out specific dates or times — overrides the weekly schedule.
        </p>
        <BlackoutDates />
      </SectionCard>
    </ProductLayout>
  )
}
