// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
export class Positioning {
    getAllStyles(element) { return window.getComputedStyle(element); }
    getStyle(element, prop) { return this.getAllStyles(element)[prop]; }
    isStaticPositioned(element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    }
    offsetParent(element) {
        let offsetParentEl = element.offsetParent || document.documentElement;
        while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = offsetParentEl.offsetParent;
        }
        return offsetParentEl || document.documentElement;
    }
    position(element, round = true) {
        let elPosition;
        let parentOffset = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 };
        if (this.getStyle(element, 'position') === 'fixed') {
            elPosition = element.getBoundingClientRect();
            elPosition = {
                top: elPosition.top,
                bottom: elPosition.bottom,
                left: elPosition.left,
                right: elPosition.right,
                height: elPosition.height,
                width: elPosition.width
            };
        }
        else {
            const offsetParentEl = this.offsetParent(element);
            elPosition = this.offset(element, false);
            if (offsetParentEl !== document.documentElement) {
                parentOffset = this.offset(offsetParentEl, false);
            }
            parentOffset.top += offsetParentEl.clientTop;
            parentOffset.left += offsetParentEl.clientLeft;
        }
        elPosition.top -= parentOffset.top;
        elPosition.bottom -= parentOffset.top;
        elPosition.left -= parentOffset.left;
        elPosition.right -= parentOffset.left;
        if (round) {
            elPosition.top = Math.round(elPosition.top);
            elPosition.bottom = Math.round(elPosition.bottom);
            elPosition.left = Math.round(elPosition.left);
            elPosition.right = Math.round(elPosition.right);
        }
        return elPosition;
    }
    offset(element, round = true) {
        const elBcr = element.getBoundingClientRect();
        const viewportOffset = {
            top: window.scrollY - document.documentElement.clientTop,
            left: window.scrollX - document.documentElement.clientLeft
        };
        let elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            top: elBcr.top + viewportOffset.top,
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };
        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }
        return elOffset;
    }
    /*
      Return false if the element to position is outside the viewport
    */
    positionElements(hostElement, targetElement, placement, appendToBody) {
        const [placementPrimary = 'top', placementSecondary = 'center'] = placement.split('-');
        const hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
        const targetElStyles = this.getAllStyles(targetElement);
        const marginTop = parseFloat(targetElStyles.marginTop);
        const marginBottom = parseFloat(targetElStyles.marginBottom);
        const marginLeft = parseFloat(targetElStyles.marginLeft);
        const marginRight = parseFloat(targetElStyles.marginRight);
        let topPosition = 0;
        let leftPosition = 0;
        switch (placementPrimary) {
            case 'top':
                topPosition = (hostElPosition.top - (targetElement.offsetHeight + marginTop + marginBottom));
                break;
            case 'bottom':
                topPosition = (hostElPosition.top + hostElPosition.height);
                break;
            case 'left':
                leftPosition = (hostElPosition.left - (targetElement.offsetWidth + marginLeft + marginRight));
                break;
            case 'right':
                leftPosition = (hostElPosition.left + hostElPosition.width);
                break;
        }
        switch (placementSecondary) {
            case 'top':
                topPosition = hostElPosition.top;
                break;
            case 'bottom':
                topPosition = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
                break;
            case 'left':
                leftPosition = hostElPosition.left;
                break;
            case 'right':
                leftPosition = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
                break;
            case 'center':
                if (placementPrimary === 'top' || placementPrimary === 'bottom') {
                    leftPosition = (hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2);
                }
                else {
                    topPosition = (hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2);
                }
                break;
        }
        /// The translate3d/gpu acceleration render a blurry text on chrome, the next line is commented until a browser fix
        // targetElement.style.transform = `translate3d(${Math.round(leftPosition)}px, ${Math.floor(topPosition)}px, 0px)`;
        targetElement.style.transform = `translate(${Math.round(leftPosition)}px, ${Math.round(topPosition)}px)`;
        // Check if the targetElement is inside the viewport
        const targetElBCR = targetElement.getBoundingClientRect();
        const html = document.documentElement;
        const windowHeight = window.innerHeight || html.clientHeight;
        const windowWidth = window.innerWidth || html.clientWidth;
        return targetElBCR.left >= 0 && targetElBCR.top >= 0 && targetElBCR.right <= windowWidth &&
            targetElBCR.bottom <= windowHeight;
    }
}
const placementSeparator = /\s+/;
export const positionService = new Positioning();
/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'left', 'right',
 *   'top-left', 'top-right',
 *   'bottom-left', 'bottom-right',
 *   'left-top', 'left-bottom',
 *   'right-top', 'right-bottom'.
 * */
export function positionElements(hostElement, targetElement, placement, appendToBody, baseClass) {
    let placementVals = Array.isArray(placement) ? placement : placement.split(placementSeparator);
    const allowedPlacements = [
        'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-top', 'left-bottom',
        'right-top', 'right-bottom'
    ];
    const classList = targetElement.classList;
    const addClassesToTarget = (targetPlacement) => {
        const [primary, secondary] = targetPlacement.split('-');
        const classes = [];
        if (baseClass) {
            classes.push(`${baseClass}-${primary}`);
            if (secondary) {
                classes.push(`${baseClass}-${primary}-${secondary}`);
            }
            classes.forEach((classname) => { classList.add(classname); });
        }
        return classes;
    };
    // Remove old placement classes to avoid issues
    if (baseClass) {
        allowedPlacements.forEach((placementToRemove) => { classList.remove(`${baseClass}-${placementToRemove}`); });
    }
    // replace auto placement with other placements
    let hasAuto = placementVals.findIndex(val => val === 'auto');
    if (hasAuto >= 0) {
        allowedPlacements.forEach(function (obj) {
            if (placementVals.find(val => val.search('^' + obj) !== -1) == null) {
                placementVals.splice(hasAuto++, 1, obj);
            }
        });
    }
    // coordinates where to position
    // Required for transform:
    const style = targetElement.style;
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style['will-change'] = 'transform';
    let testPlacement = null;
    let isInViewport = false;
    for (testPlacement of placementVals) {
        let addedClasses = addClassesToTarget(testPlacement);
        if (positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody)) {
            isInViewport = true;
            break;
        }
        // Remove the baseClasses for further calculation
        if (baseClass) {
            addedClasses.forEach((classname) => { classList.remove(classname); });
        }
    }
    if (!isInViewport) {
        // If nothing match, the first placement is the default one
        testPlacement = placementVals[0];
        addClassesToTarget(testPlacement);
        positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody);
    }
    return testPlacement;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb25pbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbC9wb3NpdGlvbmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsaUhBQWlIO0FBV2pILE1BQU0sT0FBTyxXQUFXO0lBQ2QsWUFBWSxDQUFDLE9BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9FLFFBQVEsQ0FBQyxPQUFvQixFQUFFLElBQVksSUFBWSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpHLGtCQUFrQixDQUFDLE9BQW9CO1FBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSSxRQUFRLENBQUMsS0FBSyxRQUFRLENBQUM7SUFDdkUsQ0FBQztJQUVPLFlBQVksQ0FBQyxPQUFvQjtRQUN2QyxJQUFJLGNBQWMsR0FBZ0IsT0FBTyxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDO1FBRW5GLE9BQU8sY0FBYyxJQUFJLGNBQWMsS0FBSyxRQUFRLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUMvRyxjQUFjLEdBQWdCLGNBQWMsQ0FBQyxZQUFZLENBQUM7U0FDM0Q7UUFFRCxPQUFPLGNBQWMsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDO0lBQ3BELENBQUM7SUFFRCxRQUFRLENBQUMsT0FBb0IsRUFBRSxLQUFLLEdBQUcsSUFBSTtRQUN6QyxJQUFJLFVBQXNCLENBQUM7UUFDM0IsSUFBSSxZQUFZLEdBQWUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FB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QUFHLENBQUM7SUFDakIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFdBQVcsQ0FBQztJQUVuQyxJQUFJLGFBQWEsR0FBcUIsSUFBSSxDQUFDO0lBQzNDLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixLQUFLLGFBQWEsSUFBSSxhQUFhLEVBQUU7UUFDbkMsSUFBSSxZQUFZLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFckQsSUFBSSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLEVBQUU7WUFDN0YsWUFBWSxHQUFHLElBQUksQ0FBQztZQUNwQixNQUFNO1NBQ1A7UUFFRCxpREFBaUQ7UUFDakQsSUFBSSxTQUFTLEVBQUU7WUFDYixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkU7S0FDRjtJQUVELElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDakIsMkRBQTJEO1FBQzNELGFBQWEsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzNGO0lBRUQsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHByZXZpb3VzIHZlcnNpb246XHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL2Jvb3RzdHJhcC9ibG9iLzA3YzMxZDA3MzFmN2NiMDY4YTE5MzJiOGUwMWQyMzEyYjc5NmI0ZWMvc3JjL3Bvc2l0aW9uL3Bvc2l0aW9uLmpzXHJcblxyXG5pbnRlcmZhY2UgQ2xpZW50UmVjdCB7XHJcbiAgdG9wOiBudW1iZXI7XHJcbiAgYm90dG9tOiBudW1iZXI7XHJcbiAgbGVmdDogbnVtYmVyO1xyXG4gIHJpZ2h0OiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uaW5nIHtcclxuICBwcml2YXRlIGdldEFsbFN0eWxlcyhlbGVtZW50OiBIVE1MRWxlbWVudCkgeyByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7IH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRTdHlsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgcHJvcDogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0QWxsU3R5bGVzKGVsZW1lbnQpW3Byb3BdOyB9XHJcblxyXG4gIHByaXZhdGUgaXNTdGF0aWNQb3NpdGlvbmVkKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHRoaXMuZ2V0U3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJykgfHwgJ3N0YXRpYycpID09PSAnc3RhdGljJztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb2Zmc2V0UGFyZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgbGV0IG9mZnNldFBhcmVudEVsID0gPEhUTUxFbGVtZW50PmVsZW1lbnQub2Zmc2V0UGFyZW50IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHJcbiAgICB3aGlsZSAob2Zmc2V0UGFyZW50RWwgJiYgb2Zmc2V0UGFyZW50RWwgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiB0aGlzLmlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnRFbCkpIHtcclxuICAgICAgb2Zmc2V0UGFyZW50RWwgPSA8SFRNTEVsZW1lbnQ+b2Zmc2V0UGFyZW50RWwub2Zmc2V0UGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvZmZzZXRQYXJlbnRFbCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBwb3NpdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCwgcm91bmQgPSB0cnVlKTogQ2xpZW50UmVjdCB7XHJcbiAgICBsZXQgZWxQb3NpdGlvbjogQ2xpZW50UmVjdDtcclxuICAgIGxldCBwYXJlbnRPZmZzZXQ6IENsaWVudFJlY3QgPSB7d2lkdGg6IDAsIGhlaWdodDogMCwgdG9wOiAwLCBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwfTtcclxuXHJcbiAgICBpZiAodGhpcy5nZXRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKSA9PT0gJ2ZpeGVkJykge1xyXG4gICAgICBlbFBvc2l0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgZWxQb3NpdGlvbiA9IHtcclxuICAgICAgICB0b3A6IGVsUG9zaXRpb24udG9wLFxyXG4gICAgICAgIGJvdHRvbTogZWxQb3NpdGlvbi5ib3R0b20sXHJcbiAgICAgICAgbGVmdDogZWxQb3NpdGlvbi5sZWZ0LFxyXG4gICAgICAgIHJpZ2h0OiBlbFBvc2l0aW9uLnJpZ2h0LFxyXG4gICAgICAgIGhlaWdodDogZWxQb3NpdGlvbi5oZWlnaHQsXHJcbiAgICAgICAgd2lkdGg6IGVsUG9zaXRpb24ud2lkdGhcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IG9mZnNldFBhcmVudEVsID0gdGhpcy5vZmZzZXRQYXJlbnQoZWxlbWVudCk7XHJcblxyXG4gICAgICBlbFBvc2l0aW9uID0gdGhpcy5vZmZzZXQoZWxlbWVudCwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKG9mZnNldFBhcmVudEVsICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuICAgICAgICBwYXJlbnRPZmZzZXQgPSB0aGlzLm9mZnNldChvZmZzZXRQYXJlbnRFbCwgZmFsc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwYXJlbnRPZmZzZXQudG9wICs9IG9mZnNldFBhcmVudEVsLmNsaWVudFRvcDtcclxuICAgICAgcGFyZW50T2Zmc2V0LmxlZnQgKz0gb2Zmc2V0UGFyZW50RWwuY2xpZW50TGVmdDtcclxuICAgIH1cclxuXHJcbiAgICBlbFBvc2l0aW9uLnRvcCAtPSBwYXJlbnRPZmZzZXQudG9wO1xyXG4gICAgZWxQb3NpdGlvbi5ib3R0b20gLT0gcGFyZW50T2Zmc2V0LnRvcDtcclxuICAgIGVsUG9zaXRpb24ubGVmdCAtPSBwYXJlbnRPZmZzZXQubGVmdDtcclxuICAgIGVsUG9zaXRpb24ucmlnaHQgLT0gcGFyZW50T2Zmc2V0LmxlZnQ7XHJcblxyXG4gICAgaWYgKHJvdW5kKSB7XHJcbiAgICAgIGVsUG9zaXRpb24udG9wID0gTWF0aC5yb3VuZChlbFBvc2l0aW9uLnRvcCk7XHJcbiAgICAgIGVsUG9zaXRpb24uYm90dG9tID0gTWF0aC5yb3VuZChlbFBvc2l0aW9uLmJvdHRvbSk7XHJcbiAgICAgIGVsUG9zaXRpb24ubGVmdCA9IE1hdGgucm91bmQoZWxQb3NpdGlvbi5sZWZ0KTtcclxuICAgICAgZWxQb3NpdGlvbi5yaWdodCA9IE1hdGgucm91bmQoZWxQb3NpdGlvbi5yaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVsUG9zaXRpb247XHJcbiAgfVxyXG5cclxuICBvZmZzZXQoZWxlbWVudDogSFRNTEVsZW1lbnQsIHJvdW5kID0gdHJ1ZSk6IENsaWVudFJlY3Qge1xyXG4gICAgY29uc3QgZWxCY3IgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3Qgdmlld3BvcnRPZmZzZXQgPSB7XHJcbiAgICAgIHRvcDogd2luZG93LnNjcm9sbFkgLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50VG9wLFxyXG4gICAgICBsZWZ0OiB3aW5kb3cuc2Nyb2xsWCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRMZWZ0XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBlbE9mZnNldCA9IHtcclxuICAgICAgaGVpZ2h0OiBlbEJjci5oZWlnaHQgfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQsXHJcbiAgICAgIHdpZHRoOiBlbEJjci53aWR0aCB8fCBlbGVtZW50Lm9mZnNldFdpZHRoLFxyXG4gICAgICB0b3A6IGVsQmNyLnRvcCArIHZpZXdwb3J0T2Zmc2V0LnRvcCxcclxuICAgICAgYm90dG9tOiBlbEJjci5ib3R0b20gKyB2aWV3cG9ydE9mZnNldC50b3AsXHJcbiAgICAgIGxlZnQ6IGVsQmNyLmxlZnQgKyB2aWV3cG9ydE9mZnNldC5sZWZ0LFxyXG4gICAgICByaWdodDogZWxCY3IucmlnaHQgKyB2aWV3cG9ydE9mZnNldC5sZWZ0XHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChyb3VuZCkge1xyXG4gICAgICBlbE9mZnNldC5oZWlnaHQgPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LmhlaWdodCk7XHJcbiAgICAgIGVsT2Zmc2V0LndpZHRoID0gTWF0aC5yb3VuZChlbE9mZnNldC53aWR0aCk7XHJcbiAgICAgIGVsT2Zmc2V0LnRvcCA9IE1hdGgucm91bmQoZWxPZmZzZXQudG9wKTtcclxuICAgICAgZWxPZmZzZXQuYm90dG9tID0gTWF0aC5yb3VuZChlbE9mZnNldC5ib3R0b20pO1xyXG4gICAgICBlbE9mZnNldC5sZWZ0ID0gTWF0aC5yb3VuZChlbE9mZnNldC5sZWZ0KTtcclxuICAgICAgZWxPZmZzZXQucmlnaHQgPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LnJpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZWxPZmZzZXQ7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAgUmV0dXJuIGZhbHNlIGlmIHRoZSBlbGVtZW50IHRvIHBvc2l0aW9uIGlzIG91dHNpZGUgdGhlIHZpZXdwb3J0XHJcbiAgKi9cclxuICBwb3NpdGlvbkVsZW1lbnRzKGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudCwgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQsIHBsYWNlbWVudDogc3RyaW5nLCBhcHBlbmRUb0JvZHk/OiBib29sZWFuKTpcclxuICAgICAgYm9vbGVhbiB7XHJcbiAgICBjb25zdFtwbGFjZW1lbnRQcmltYXJ5ID0gJ3RvcCcsIHBsYWNlbWVudFNlY29uZGFyeSA9ICdjZW50ZXInXSA9IHBsYWNlbWVudC5zcGxpdCgnLScpO1xyXG5cclxuICAgIGNvbnN0IGhvc3RFbFBvc2l0aW9uID0gYXBwZW5kVG9Cb2R5ID8gdGhpcy5vZmZzZXQoaG9zdEVsZW1lbnQsIGZhbHNlKSA6IHRoaXMucG9zaXRpb24oaG9zdEVsZW1lbnQsIGZhbHNlKTtcclxuICAgIGNvbnN0IHRhcmdldEVsU3R5bGVzID0gdGhpcy5nZXRBbGxTdHlsZXModGFyZ2V0RWxlbWVudCk7XHJcblxyXG4gICAgY29uc3QgbWFyZ2luVG9wID0gcGFyc2VGbG9hdCh0YXJnZXRFbFN0eWxlcy5tYXJnaW5Ub3ApO1xyXG4gICAgY29uc3QgbWFyZ2luQm90dG9tID0gcGFyc2VGbG9hdCh0YXJnZXRFbFN0eWxlcy5tYXJnaW5Cb3R0b20pO1xyXG4gICAgY29uc3QgbWFyZ2luTGVmdCA9IHBhcnNlRmxvYXQodGFyZ2V0RWxTdHlsZXMubWFyZ2luTGVmdCk7XHJcbiAgICBjb25zdCBtYXJnaW5SaWdodCA9IHBhcnNlRmxvYXQodGFyZ2V0RWxTdHlsZXMubWFyZ2luUmlnaHQpO1xyXG5cclxuICAgIGxldCB0b3BQb3NpdGlvbiA9IDA7XHJcbiAgICBsZXQgbGVmdFBvc2l0aW9uID0gMDtcclxuXHJcbiAgICBzd2l0Y2ggKHBsYWNlbWVudFByaW1hcnkpIHtcclxuICAgICAgY2FzZSAndG9wJzpcclxuICAgICAgICB0b3BQb3NpdGlvbiA9IChob3N0RWxQb3NpdGlvbi50b3AgLSAodGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQgKyBtYXJnaW5Ub3AgKyBtYXJnaW5Cb3R0b20pKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgICB0b3BQb3NpdGlvbiA9IChob3N0RWxQb3NpdGlvbi50b3AgKyBob3N0RWxQb3NpdGlvbi5oZWlnaHQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdsZWZ0JzpcclxuICAgICAgICBsZWZ0UG9zaXRpb24gPSAoaG9zdEVsUG9zaXRpb24ubGVmdCAtICh0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoICsgbWFyZ2luTGVmdCArIG1hcmdpblJpZ2h0KSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgICBsZWZ0UG9zaXRpb24gPSAoaG9zdEVsUG9zaXRpb24ubGVmdCArIGhvc3RFbFBvc2l0aW9uLndpZHRoKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKHBsYWNlbWVudFNlY29uZGFyeSkge1xyXG4gICAgICBjYXNlICd0b3AnOlxyXG4gICAgICAgIHRvcFBvc2l0aW9uID0gaG9zdEVsUG9zaXRpb24udG9wO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdib3R0b20nOlxyXG4gICAgICAgIHRvcFBvc2l0aW9uID0gaG9zdEVsUG9zaXRpb24udG9wICsgaG9zdEVsUG9zaXRpb24uaGVpZ2h0IC0gdGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICAgIGxlZnRQb3NpdGlvbiA9IGhvc3RFbFBvc2l0aW9uLmxlZnQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgICBsZWZ0UG9zaXRpb24gPSBob3N0RWxQb3NpdGlvbi5sZWZ0ICsgaG9zdEVsUG9zaXRpb24ud2lkdGggLSB0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdjZW50ZXInOlxyXG4gICAgICAgIGlmIChwbGFjZW1lbnRQcmltYXJ5ID09PSAndG9wJyB8fCBwbGFjZW1lbnRQcmltYXJ5ID09PSAnYm90dG9tJykge1xyXG4gICAgICAgICAgbGVmdFBvc2l0aW9uID0gKGhvc3RFbFBvc2l0aW9uLmxlZnQgKyBob3N0RWxQb3NpdGlvbi53aWR0aCAvIDIgLSB0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRvcFBvc2l0aW9uID0gKGhvc3RFbFBvc2l0aW9uLnRvcCArIGhvc3RFbFBvc2l0aW9uLmhlaWdodCAvIDIgLSB0YXJnZXRFbGVtZW50Lm9mZnNldEhlaWdodCAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICAvLy8gVGhlIHRyYW5zbGF0ZTNkL2dwdSBhY2NlbGVyYXRpb24gcmVuZGVyIGEgYmx1cnJ5IHRleHQgb24gY2hyb21lLCB0aGUgbmV4dCBsaW5lIGlzIGNvbW1lbnRlZCB1bnRpbCBhIGJyb3dzZXIgZml4XHJcbiAgICAvLyB0YXJnZXRFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke01hdGgucm91bmQobGVmdFBvc2l0aW9uKX1weCwgJHtNYXRoLmZsb29yKHRvcFBvc2l0aW9uKX1weCwgMHB4KWA7XHJcbiAgICB0YXJnZXRFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtNYXRoLnJvdW5kKGxlZnRQb3NpdGlvbil9cHgsICR7TWF0aC5yb3VuZCh0b3BQb3NpdGlvbil9cHgpYDtcclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGUgdGFyZ2V0RWxlbWVudCBpcyBpbnNpZGUgdGhlIHZpZXdwb3J0XHJcbiAgICBjb25zdCB0YXJnZXRFbEJDUiA9IHRhcmdldEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IHx8IGh0bWwuY2xpZW50SGVpZ2h0O1xyXG4gICAgY29uc3Qgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBodG1sLmNsaWVudFdpZHRoO1xyXG5cclxuICAgIHJldHVybiB0YXJnZXRFbEJDUi5sZWZ0ID49IDAgJiYgdGFyZ2V0RWxCQ1IudG9wID49IDAgJiYgdGFyZ2V0RWxCQ1IucmlnaHQgPD0gd2luZG93V2lkdGggJiZcclxuICAgICAgICB0YXJnZXRFbEJDUi5ib3R0b20gPD0gd2luZG93SGVpZ2h0O1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcGxhY2VtZW50U2VwYXJhdG9yID0gL1xccysvO1xyXG5leHBvcnQgY29uc3QgcG9zaXRpb25TZXJ2aWNlID0gbmV3IFBvc2l0aW9uaW5nKCk7XHJcblxyXG4vKlxyXG4gKiBBY2NlcHQgdGhlIHBsYWNlbWVudCBhcnJheSBhbmQgYXBwbGllcyB0aGUgYXBwcm9wcmlhdGUgcGxhY2VtZW50IGRlcGVuZGVudCBvbiB0aGUgdmlld3BvcnQuXHJcbiAqIFJldHVybnMgdGhlIGFwcGxpZWQgcGxhY2VtZW50LlxyXG4gKiBJbiBjYXNlIG9mIGF1dG8gcGxhY2VtZW50LCBwbGFjZW1lbnRzIGFyZSBzZWxlY3RlZCBpbiBvcmRlclxyXG4gKiAgICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnLFxyXG4gKiAgICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLFxyXG4gKiAgICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnLFxyXG4gKiAgICdsZWZ0LXRvcCcsICdsZWZ0LWJvdHRvbScsXHJcbiAqICAgJ3JpZ2h0LXRvcCcsICdyaWdodC1ib3R0b20nLlxyXG4gKiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcG9zaXRpb25FbGVtZW50cyhcclxuICAgIGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudCwgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQsIHBsYWNlbWVudDogc3RyaW5nIHwgUGxhY2VtZW50IHwgUGxhY2VtZW50QXJyYXksXHJcbiAgICBhcHBlbmRUb0JvZHk/OiBib29sZWFuLCBiYXNlQ2xhc3M/OiBzdHJpbmcpOiBQbGFjZW1lbnQgfFxyXG4gICAgbnVsbCB7XHJcbiAgbGV0IHBsYWNlbWVudFZhbHM6IEFycmF5PFBsYWNlbWVudD4gPVxyXG4gICAgICBBcnJheS5pc0FycmF5KHBsYWNlbWVudCkgPyBwbGFjZW1lbnQgOiBwbGFjZW1lbnQuc3BsaXQocGxhY2VtZW50U2VwYXJhdG9yKSBhcyBBcnJheTxQbGFjZW1lbnQ+O1xyXG5cclxuICBjb25zdCBhbGxvd2VkUGxhY2VtZW50cyA9IFtcclxuICAgICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnLCAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsICdsZWZ0LXRvcCcsICdsZWZ0LWJvdHRvbScsXHJcbiAgICAncmlnaHQtdG9wJywgJ3JpZ2h0LWJvdHRvbSdcclxuICBdO1xyXG5cclxuICBjb25zdCBjbGFzc0xpc3QgPSB0YXJnZXRFbGVtZW50LmNsYXNzTGlzdDtcclxuICBjb25zdCBhZGRDbGFzc2VzVG9UYXJnZXQgPSAodGFyZ2V0UGxhY2VtZW50OiBQbGFjZW1lbnQpOiBBcnJheTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0W3ByaW1hcnksIHNlY29uZGFyeV0gPSB0YXJnZXRQbGFjZW1lbnQuc3BsaXQoJy0nKTtcclxuICAgIGNvbnN0IGNsYXNzZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBpZiAoYmFzZUNsYXNzKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChgJHtiYXNlQ2xhc3N9LSR7cHJpbWFyeX1gKTtcclxuICAgICAgaWYgKHNlY29uZGFyeSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChgJHtiYXNlQ2xhc3N9LSR7cHJpbWFyeX0tJHtzZWNvbmRhcnl9YCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNsYXNzZXMuZm9yRWFjaCgoY2xhc3NuYW1lKSA9PiB7IGNsYXNzTGlzdC5hZGQoY2xhc3NuYW1lKTsgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xhc3NlcztcclxuICB9O1xyXG5cclxuICAvLyBSZW1vdmUgb2xkIHBsYWNlbWVudCBjbGFzc2VzIHRvIGF2b2lkIGlzc3Vlc1xyXG4gIGlmIChiYXNlQ2xhc3MpIHtcclxuICAgIGFsbG93ZWRQbGFjZW1lbnRzLmZvckVhY2goKHBsYWNlbWVudFRvUmVtb3ZlKSA9PiB7IGNsYXNzTGlzdC5yZW1vdmUoYCR7YmFzZUNsYXNzfS0ke3BsYWNlbWVudFRvUmVtb3ZlfWApOyB9KTtcclxuICB9XHJcblxyXG4gIC8vIHJlcGxhY2UgYXV0byBwbGFjZW1lbnQgd2l0aCBvdGhlciBwbGFjZW1lbnRzXHJcbiAgbGV0IGhhc0F1dG8gPSBwbGFjZW1lbnRWYWxzLmZpbmRJbmRleCh2YWwgPT4gdmFsID09PSAnYXV0bycpO1xyXG4gIGlmIChoYXNBdXRvID49IDApIHtcclxuICAgIGFsbG93ZWRQbGFjZW1lbnRzLmZvckVhY2goZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgIGlmIChwbGFjZW1lbnRWYWxzLmZpbmQodmFsID0+IHZhbC5zZWFyY2goJ14nICsgb2JqKSAhPT0gLTEpID09IG51bGwpIHtcclxuICAgICAgICBwbGFjZW1lbnRWYWxzLnNwbGljZShoYXNBdXRvKyssIDEsIG9iaiBhcyBQbGFjZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIGNvb3JkaW5hdGVzIHdoZXJlIHRvIHBvc2l0aW9uXHJcblxyXG4gIC8vIFJlcXVpcmVkIGZvciB0cmFuc2Zvcm06XHJcbiAgY29uc3Qgc3R5bGUgPSB0YXJnZXRFbGVtZW50LnN0eWxlO1xyXG4gIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICBzdHlsZS50b3AgPSAnMCc7XHJcbiAgc3R5bGUubGVmdCA9ICcwJztcclxuICBzdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICd0cmFuc2Zvcm0nO1xyXG5cclxuICBsZXQgdGVzdFBsYWNlbWVudDogUGxhY2VtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IGlzSW5WaWV3cG9ydCA9IGZhbHNlO1xyXG4gIGZvciAodGVzdFBsYWNlbWVudCBvZiBwbGFjZW1lbnRWYWxzKSB7XHJcbiAgICBsZXQgYWRkZWRDbGFzc2VzID0gYWRkQ2xhc3Nlc1RvVGFyZ2V0KHRlc3RQbGFjZW1lbnQpO1xyXG5cclxuICAgIGlmIChwb3NpdGlvblNlcnZpY2UucG9zaXRpb25FbGVtZW50cyhob3N0RWxlbWVudCwgdGFyZ2V0RWxlbWVudCwgdGVzdFBsYWNlbWVudCwgYXBwZW5kVG9Cb2R5KSkge1xyXG4gICAgICBpc0luVmlld3BvcnQgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdGhlIGJhc2VDbGFzc2VzIGZvciBmdXJ0aGVyIGNhbGN1bGF0aW9uXHJcbiAgICBpZiAoYmFzZUNsYXNzKSB7XHJcbiAgICAgIGFkZGVkQ2xhc3Nlcy5mb3JFYWNoKChjbGFzc25hbWUpID0+IHsgY2xhc3NMaXN0LnJlbW92ZShjbGFzc25hbWUpOyB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICghaXNJblZpZXdwb3J0KSB7XHJcbiAgICAvLyBJZiBub3RoaW5nIG1hdGNoLCB0aGUgZmlyc3QgcGxhY2VtZW50IGlzIHRoZSBkZWZhdWx0IG9uZVxyXG4gICAgdGVzdFBsYWNlbWVudCA9IHBsYWNlbWVudFZhbHNbMF07XHJcbiAgICBhZGRDbGFzc2VzVG9UYXJnZXQodGVzdFBsYWNlbWVudCk7XHJcbiAgICBwb3NpdGlvblNlcnZpY2UucG9zaXRpb25FbGVtZW50cyhob3N0RWxlbWVudCwgdGFyZ2V0RWxlbWVudCwgdGVzdFBsYWNlbWVudCwgYXBwZW5kVG9Cb2R5KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0ZXN0UGxhY2VtZW50O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBQbGFjZW1lbnQgPSAnYXV0bycgfCAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AtbGVmdCcgfCAndG9wLXJpZ2h0JyB8ICdib3R0b20tbGVmdCcgfFxyXG4gICAgJ2JvdHRvbS1yaWdodCcgfCAnbGVmdC10b3AnIHwgJ2xlZnQtYm90dG9tJyB8ICdyaWdodC10b3AnIHwgJ3JpZ2h0LWJvdHRvbSc7XHJcblxyXG5leHBvcnQgdHlwZSBQbGFjZW1lbnRBcnJheSA9IFBsYWNlbWVudCB8IEFycmF5PFBsYWNlbWVudD58IHN0cmluZztcclxuIl19