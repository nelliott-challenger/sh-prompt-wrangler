# Prompt Wrangler

## Running the app:
Prerequisites:
- Node 22.14
- pnpm

1. Clone the repo
2. Run `pnpm install`
3. Run `pnpm run dev` -- this starts the dev server
4. In the browser, navigate to the localhost URL output from the previous step.
5. use `pnpm run test` to run unit tests


## Prompts
While the app can be used to play around with different prompts, the prompts I came up with for the challenge are in 
`prompts.txt`. These seem to work best (so far) with 1.0 as the temperature.

## My approach
Overall, given the challenge seemed to be looking for a lightweight tool with an MVP mindset, I leaned heavily on AI (specifically Cursor's agent mode) and a tech stack I'm familiar with so that I could deliver as much of the core functionality as I could in 1 hour while still being reasonably happy with my unit tests and code quality. As for the styling, since I was only focused on the functionality, I simply let the AI do whatever it chose to do.

My approach step-by-step:
1. Create a basic app scaffold using Vite tooling that got me up-and-running with a basic React app.
2. Replace the scaffold App.tsx with one that has a basic form for user input that displays whatever the user submits in the form in an output box.
3. Expand this form to include all of my desired inputs, but still just display those inputs in the output box.
4. Create a service file for the OpenAI integration, but just have it return the user input to start.
5. Build out the OpenAI integration for real. Construction of the request body contains the first real logic that I felt warranted a test suite, so I built out unit tests at this point so as I made further changes I could be confident I wasn't breaking my integration with OpenAI. 
6. Now that I have a working OpenAI integration for a basic prompt, ensure I have the required usage statistics displayed and can show JSON content in the output.
7. Finally, construct a system prompt and user prompt that can, as requested, extract structured data from unstructured clinical notes in a manner similar to the examples provided.

## With more time, I would...
1. Allow the "output" to display more than just JSON. Currently, the "content" portion of the output display section _assumes_ the content portion of the OpenAI response is JSON. This is clearly not great, as the app currently crashes if you provide a set of prompts and input that don't result in structured output.
2. Similarly, "harden" the form. There is currently no validation of any kind, when I would probably like at least some of the fields to be required (or have some sensible defaults) before allowing sending the request to OpenAI. For example, I might want to cap max tokens by default to limit token consumption (and even put a max value on what the user is allowed to provide for this parameter). There are likely other edge cases that aren't handled well, too.
3. Spend some more time on my prompts. When using the prompts, I used 5 of the examples in my user prompt and the 6th as a test to see how close I would get to the desired output. It's close, but definitely missing it by a bit. If possible, I would attempt to define actual schema that I could provide as part of the prompt instead of relying solely on the examples.
4. Tackle a couple of the stretch goals -- I would've found saving prompt/output runs super useful as I found myself making small adjustments and bouncing back and forth between my tool and my prompts.txt document. I would prefer to have a tool that allowed me to stay in the one context.
5. Since I did leverage AI to help me build this tool, with more time I would much more carefully review the generated code for any issues, strange choices, or odd names / patterns that make it hard to understand what's going on.
