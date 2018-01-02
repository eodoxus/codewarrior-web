export default class State {
  subject;

  constructor(subject) {
    this.subject = subject;
    const state = this.subject.getBehavior().getState();
    state && state.exit();
    this.enter(...stripSubjectFrom(arguments));
  }

  enter() {
    // Override this
    return this;
  }

  exit() {
    // Override this
    return this;
  }

  handleEvent(input) {
    // Override this
    return this;
  }

  pickAnimation() {
    // Override this
  }

  update() {
    // Override this
    return this;
  }
}

function stripSubjectFrom(inArgs) {
  const outArgs = [];
  for (let iDx = 1; iDx < inArgs.length; iDx++) {
    outArgs.push(inArgs[iDx]);
  }
  return outArgs;
}
