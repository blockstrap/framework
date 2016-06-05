/*
 * 
 *  Blockstrap v0.6.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var html = {};
    
    html.form = function()
    {
        return '{{#objects}}{{^fields_only}}<form id="{{id}}" class="{{css}}"><!-- HACK FOR IE/FIREBUG --><div style="display:none;"><input type="text" id="fake_username_field"/><input type="password" id="fake_password_field"/></div>  <!-- END OF AUTO-COMPLETE HACK -->{{/fields_only}}{{#fields}}<div class="form-group {{css}}">{{#inputs}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<input type="{{type}}" id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" value="{{value}}" autocomplete="off"{{#attributes}} {{key}}="{{value}}"{{/attributes}} />{{#icon}}{{#href}}<a id="{{id}}" class="{{css}}" href="{{href}}" {{#attributes}}{{key}}="{{value}}"{{/attributes}}>{{/href}}{{#glyph}}<span class="glyphicon glyphicon-{{glyph}}"></span>{{/glyph}}{{#href}}</a>{{/href}}{{/icon}}{{#wrapper.css}}</div>{{/wrapper.css}}{{/inputs}}{{#areas}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<textarea id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" style="{{style}}">{{value}}</textarea>{{#wrapper.css}}</div>{{/wrapper.css}}{{/areas}}{{#selects}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<select id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" autocomplete="off"{{#attributes}} {{key}}="{{value}}"{{/attributes}}>{{#values}}<option value="{{value}}" {{selected}}>{{text}}</option>{{/values}}</select>{{#wrapper.css}}</div>{{/wrapper.css}}{{/selects}}</div>{{#hidden}}<input type="hidden" value="{{value}}" id="{{id}}" />{{/hidden}}{{/fields}}{{#buttons}}<div class="actions row"><div class="col-sm-12">{{#forms}}<button type="{{type}}" id="{{id}}" class="btn {{css}}" {{#attributes}}{{key}}="{{value}}"{{/attributes}}>{{text}}</button>{{/forms}}</div></div>{{/buttons}}{{^fields_only}}</form>{{/fields_only}}{{/objects}}';
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {html:html});
})
(jQuery);
