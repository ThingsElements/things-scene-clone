/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
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
    label: 'targetRetention',
    name: 'targetRetention',
    property: 'targetRetention'
  }]
}

var { RectPath, Shape, Model } = scene

function clone(cloner, target, targetRetention) {

  var targetComponent = cloner.root.findById(target);
  if(!targetComponent)
    return

  var clone = Object.assign(targetComponent.hierarchy, {
    templatePrefix: '',
    id: ''
  })

  if(targetRetention)
    clone.retention = targetRetention;

  var component = Model.compile(clone, cloner.app)
  var index = targetComponent.parent.indexOf(targetComponent)
  targetComponent.parent.insertComponentAt(component, index + 1)

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
    this.started = false;
    super.dispose();
  }

  _draw(ctx) {

    var {
      left,
      top,
      width,
      height
    } = this.bounds;

    ctx.beginPath();

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    ctx.rect(left, top, width * 0.8, height * 0.8);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();

    ctx.rect(left + width * 0.2, top + height * 0.2, width * 0.8, height * 0.8);
  }

  get nature(){
    return NATURE;
  }

  get started() {
    return this._started;
  }

  set started(started) {

    if(!!this.started == !!started)
      return;

    this._started = !!started;

    if(!this.app.isViewMode)
      return

    if(this._started) {
      var {
        repeat,
        duration,
        target,
        targetRetention
      } = this.model;

      if(!target)
        return

      if(duration < 500)
        duration = 500

      console.log('duration', duration)

      let self = this;

      function _() {
        if(!self._started || !clone(self, target, targetRetention) || !duration || !repeat) {
          self._started = false;
          return
        }

        self._timeout = setTimeout(() => {
          requestAnimationFrame(_)
        }, duration)
      }

      requestAnimationFrame(_)
    } else {
      if(this._timeout) {
        clearTimeout(this._timeout)
        this._timeout = 0
      }
    }
  }
}

scene.Component.register('clone', Clone);
