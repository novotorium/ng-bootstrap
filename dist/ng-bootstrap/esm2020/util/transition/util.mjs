export function getTransitionDurationMs(element) {
    const { transitionDelay, transitionDuration } = window.getComputedStyle(element);
    const transitionDelaySec = parseFloat(transitionDelay);
    const transitionDurationSec = parseFloat(transitionDuration);
    return (transitionDelaySec + transitionDurationSec) * 1000;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlsL3RyYW5zaXRpb24vdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsdUJBQXVCLENBQUMsT0FBb0I7SUFDMUQsTUFBTSxFQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBQyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvRSxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN2RCxNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRTdELE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUM3RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zaXRpb25EdXJhdGlvbk1zKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgY29uc3Qge3RyYW5zaXRpb25EZWxheSwgdHJhbnNpdGlvbkR1cmF0aW9ufSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xyXG4gIGNvbnN0IHRyYW5zaXRpb25EZWxheVNlYyA9IHBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KTtcclxuICBjb25zdCB0cmFuc2l0aW9uRHVyYXRpb25TZWMgPSBwYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbik7XHJcblxyXG4gIHJldHVybiAodHJhbnNpdGlvbkRlbGF5U2VjICsgdHJhbnNpdGlvbkR1cmF0aW9uU2VjKSAqIDEwMDA7XHJcbn1cclxuIl19