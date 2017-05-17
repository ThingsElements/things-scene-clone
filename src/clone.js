const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
    type: 'number',
    label: 'duration',
    name: 'duration',
    property: 'duration'
  },{
    type: 'string',
    label: 'target',
    name: 'target',
    property: 'target'
  },{
    type: 'checkbox',
    label: 'repeat',
    name: 'repeat',
    property: 'repeat'
  },{
    type: 'checkbox',
    label: 'autostart',
    name: 'autostart',
    property: 'autostart'
  },{
    type: 'number',
    label: 'targetRetension',
    name: 'targetRetension',
    property: 'targetRetension'
  }]
}

var { RectPath, Shape, Model } = scene

function clone(cloner, target, targetRetension) {

  var targetComponent = cloner.root.findById(target);
  if(!targetComponent)
    return

  var clone = Object.assign(targetComponent.hierarchy, {
    templatePrefix: '',
    id: ''
  })

  if(targetRetension)
    clone.retension = targetRetension;

  var component = Model.compile(clone, cloner.app)
  var index = targetComponent.parent.indexOf(targetComponent)
  targetComponent.parent.insertComponentAt(component, index + 1)

  component.hidden = false;
  // component.started = true;
  // component._animation('oncreate').started = true;

  return component;
}

export default class Clone extends RectPath(Shape) {

  added(parent) {
    this.started = false;
    setTimeout(() => {
      if(this.get('autostart'))
        this.started = true
    }, 500)
  }

  dispose() {
    clearTimeout(this._timeout);
    super.dispose();
  }

  get hidden() {
    return true;
  }

  _draw(ctx) {

    var {
      left,
      top,
      width,
      height
    } = this.bounds;

    ctx.beginPath();

    ctx.rect(left, top, width, height);
  }

  get nature(){
    return NATURE;
  }

  get started() {
    return this._started;
  }

  set started(started) {
    if(this.started === !!started)
      return;

    this._started = started;

    if(!!this._started && this.app.isViewMode) {
      var {
        repeat,
        duration,
        target,
        targetRetension
      } = this.model;

      if(!target)
        return

      if(duration < 500)
        duration = 500

      let self = this;

      function _() {
        if(!self._started || !clone(self, target, targetRetension) || !duration || !repeat) {
          self._started = false;
          return
        }

        self._timeout = setTimeout(() => {
          requestAnimationFrame(_)
        }, duration)
      }

      requestAnimationFrame(_)
    }
  }
}

scene.Component.register('clone', Clone);
