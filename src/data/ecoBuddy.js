import { ACTIONS } from "./actions";

export const SUGGESTED_QUESTIONS = [
  "How can I reduce my carbon footprint?",
  "What should I change first?",
  "Give me a sustainable challenge.",
  "How much CO₂ can I save?",
];

const pick = (id) => ACTIONS.find((a) => a.id === id);

export function getEcoReply(raw, ctx = {}) {
  const text = (raw || "").toLowerCase();
  const has = (...k) => k.some((w) => text.includes(w));
  const { level, streak = 0, co2Saved = 0, actionsCompleted = 0, footprint } = ctx;

  if (has("hello", "hi ", "hey", "namaste")) {
    return "Hey — EcoSphere here. 🌱 I read your logged actions and turn them into the next best move. Tell me one thing about your day (commute, meals, electricity) and I'll find the biggest cut.";
  }

  if (has("car", "drive", "commute", "travel", "km to", "bike", "cycle", "bus", "metro", "transport")) {
    const t = pick("cycle-to-campus");
    return `Transport is where daily habits stack up fastest. If ${
      ctx.commute ? `your ${ctx.commute} trip` : "one regular trip"
    } is by car, switching just two trips a week to cycling or public transport trims roughly ${t.co2.toFixed(1)}–2.5 kg CO₂e per swap — about ${(
      (t.co2 + 1.6) * 2 * 52
    ).toLocaleString(undefined, { maximumFractionDigits: 0 })} kg a year. Try the 7-Day Green Transport Challenge and log each swap so the number becomes real.`;
  }

  if (has("fly", "flight", "plane", "airport", "holiday", "vacation")) {
    return "One short-haul flight is often a quarter of a year's personal footprint in a single day. If the trip is under ~700 km, rail usually wins on door-to-door time too. When flying is unavoidable: direct routes, economy seat, and pack light — each cuts the per-passenger number.";
  }

  if (has("electric", "power", "energy", "bill", "heating", "thermostat", "solar", "renewable")) {
    return "Home energy has two big levers: the tariff you're on and the temperature you hold. Switching to a renewable tariff removes most of your electricity emissions in one form-filling evening; dropping the thermostat 1 °C saves about 7% of heating fuel. Then handle the small stuff — standby strips, 30° washes, LEDs.";
  }

  if (has("food", "eat", "meat", "beef", "vegetarian", "vegan", "plant", "diet", "protein")) {
    return "Food is the footprint you can change three times a day. You don't need to go fully plant-based to move the needle: one meat-free day a week is around 3.4 kg CO₂e, swapping beef for lentils twice a week is roughly 27 kg a year, and cooking what you've already bought beats any diet change for waste.";
  }

  if (has("waste", "recycle", "plastic", "compost", "bin", "trash", "rubbish")) {
    return "Waste works from the top down: refuse, reduce, reuse, then recycle. A single reusable bottle and cup routine removes ~30 kg CO₂e a year, and sorting cleanly matters — a greasy pizza box or a wet newspaper can send a whole recycling batch to recovery. Composting food scraps is the second biggest lever in this category.";
  }

  if (has("shopping", "buy", "fashion", "clothes", "shoes", "second", "thrift", "consume")) {
    return "Every new item carries manufacturing emissions before it reaches you — so extending a garment's life by nine months cuts its footprint around 20–30%. Rules of thumb: 72-hour wait on anything non-essential, search second-hand first, repair before replace. That last one is worth ~3.2 kg CO₂e each time.";
  }

  if (has("water", "shower", "tap", "laundry load", "drip")) {
    return "Water and energy are tangled together: hot water is the expensive part. Five-minute showers, full machine loads and one fixed dripping tap add up to a few hundred litres and roughly 20–30 kg CO₂e a year. A rain barrel for plants is a nice bonus.";
  }

  if (has("first", "start", "begin", "where should i", "change first", "priorit")) {
    return footprint
      ? `Your calculator result says it plainly: ${footprint.biggest.toLowerCase()} is your largest contribution at ${footprint.biggestValue.toFixed(
          1
        )} tonnes. Start there — the biggest slice is where a small habit change produces a large number. Then pick two Easy actions you can do without thinking, like cold-wash laundry and standby power-down.`
      : "Start with the single biggest slice of your life: how you get around, then how your home is heated and powered. Run the carbon footprint calculator here and it'll tell you exactly which category to attack first — no guesswork.";
  }

  if (has("how much", "save", "savings", "total", "impact", "co2", "tonne", "ton")) {
    return `So far you've logged ${co2Saved.toFixed(1)} kg CO₂e avoided across ${actionsCompleted} actions — that's like taking a petrol car off the road for about ${Math.round(
      co2Saved / 0.192
    ).toLocaleString()} km. If you clear one action a day this month at your current average (${
      actionsCompleted ? (co2Saved / actionsCompleted).toFixed(1) : "0.9"
    } kg each), you'd bank another ${Math.round((actionsCompleted ? co2Saved / actionsCompleted : 0.9) * 30)} kg by month end.`;
  }

  if (has("challenge", "streak", "motivat", "habit", "commit")) {
    return `Take the Zero-Waste Week — seven days, no single-use items, nothing left unsorted, worth 700 Eco Points. ${
      streak >= 5 ? `You already have a ${streak}-day streak, so the habit glue is there.` : "Do it on a seven-day run so one miss doesn't break the whole thing."
    } If you'd rather start smaller, the Water-Wise Week is a gentler 400-point entry.`;
  }

  if (has("badge", "level", "points", "rank", "leaderboard")) {
    return `You're at ${level || "Seedling"} right now. Points come fast from category streaks: 10 waste actions unlocks Waste Warrior, 15 transport actions unlocks Green Commuter, and 100 kg saved unlocks Climate Champion. Two or three actions a day and you'll cross 2,500 points — the Eco Point Runner badge — inside a fortnight.`;
  }

  if (has("flight school", "college", "school", "office", "work")) {
    return "Commuting is the most repeatable footprint there is — which makes it the most fixable. Two car-free days a week over a term beats any heroic one-off gesture. Log each green commute and watch the weekly chart fill.";
  }

  return `Here's what I'd do with your week: pick one action from your biggest category, one Easy action you already half-do, and today's daily challenge. That's roughly ${(
    0.6 + (co2Saved / Math.max(actionsCompleted, 1)) * 2
  ).toFixed(1)}–4 kg CO₂e and about 110 Eco Points. Ask me about transport, food, energy, waste, water or shopping for a sharper plan — or say "give me a challenge".`;
}
