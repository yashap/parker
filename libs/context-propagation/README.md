# context-propagation

A small library to make Context Propagation easier.

For example, say when you're logging, you want every log to have:
- The id of the user who made the request
- A "correlation id" (some unique id that's the same for XXX)
