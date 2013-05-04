# Pomodoro tracking software to help track progress on tasks/habits and reward yourself for being diligent.  
Uses a Rewards-based pomodoro tracking metaphor of arcade tickets.  Win at arcade games, get tickets, buy trinkets.  Complete pomodoros, get tickets, reward yourself with things from the store (which you define).

You fill the store and determine the prices.  Later on link to the prizes as links to amazon/etc (any store) and buy sends you to the site (v1). Next use the api to buy directly when you turn in your tickets and hit buy.  Should see a graphic of a roll of tickets gradually growing in size.  Use a similar icon to represent prices (have the exact number in the middle of the roll) so you can compare your haul with the cost needed, you'll see those desires getting closer.

Basic func: 1 press to start pomo, alarm goes off after the time. The time can be set in options but is out of the box 25.  you then start the break timer.  it goes for 5 mins and another alarm goes off.  then the pomodoro timer resets and you press again to start the next cycle.  You don't get credit for the pomodoro until you finish the break as well.

Inspiration:
From android store:
1. Clockwork tomato - Has a very pretty clock/timer.  Marks off on the clock an arc for pomodoro time and break time (in different colors)
2. Habits - Breaks down pomodoros by your goals (e.g. course work, exercise, french, piano etc.) Shows a week view that illustrates pomodoros consecutively.
3. Pomodoro master - Allows to set goals
4. Pomodroido - Leveling. (Level: Apprentice(1) <---progress bar+++> Pomodoros until next level: 4)

From apple store:
1. dPomodoro - Interruptions/cancellation.  You can mark a pomodoro as interrupted or canceled.  Could be useful.


## LEFT OFF

### Create a basic javascript timer
 + (DONE) Build the timer
 + Add a button to start/stop the timer
 + Add a button to reset the timer
