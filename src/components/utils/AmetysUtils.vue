
<script>

import PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N from '../MessageFrench';
import moment from "moment";

export default {

    COLORS: ['purple', 'pink', 'blue', 'green', 'teal', 'indigo', 'red', 'orange', 'lime', 'grey', 'amber', 'brown'],

      methods: {


    /**
     * Get a readable date, with relative time (eg: '4 days ago') for duration less that 7 days by default.
     * @param {String} date The raw date
     * @param {Number} [relativeLimit=7] limit in days for relative date
     * @param {Number} [withoutRelativeSuffix=false] true to get the relative time without the suffix (eg: '4 days')
     * @param {Boolean} [withHours=false] true to format date with hours
     * @return {String} the readable date
     */

    toMomentDate (date, relativeLimit, withoutRelativeSuffix, withHours)
    {
        relativeLimit = relativeLimit || 7;
        withoutRelativeSuffix = withoutRelativeSuffix === true;

      let now = moment();
      let momentDate = moment(date);

      let diff = now.diff(momentDate);
      let duration = moment.duration(diff);
      let days = duration.asDays();
      let isSameYear = now.isSame(momentDate, 'year');

        if (days > 1 && days < 2)
        {
            // eg: hier, 16h45
            return moment(date).format(PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N ? PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N.PLUGINS_WORKSPACES_DATE_FORMAT_YESTERDAY : "{{i18n plugin.workspaces:PLUGINS_WORKSPACES_DATE_FORMAT_YESTERDAY}}");
        }
      else if (days < relativeLimit)
      {
            // eg: il y a 26 min, il y a 2h, il y a 5 jours
          return momentDate.fromNow(withoutRelativeSuffix);
      }
      else if (isSameYear)
      {
            // eg: le 26 juin, le 10 juillet à 11h30
            return withHours ? momentDate.format(PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N ? PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N.PLUGINS_WORKSPACES_DATE_TIME_FORMAT : "{{i18n plugin.workspaces:PLUGINS_WORKSPACES_DATE_TIME_FORMAT}}") : momentDate.format(PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N ? PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N.PLUGINS_WORKSPACES_DATE_FORMAT : "{{i18n plugin.workspaces:PLUGINS_WORKSPACES_DATE_FORMAT}}");
      }
      else
      {
            // eg: le 26 juin 2020, le 10 juillet 2020 à 11h30
            return withHours ? momentDate.format(PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N ? PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N.PLUGINS_WORKSPACES_DATE_TIME_FORMAT_WITH_YEAR : "{{i18n plugin.workspaces:PLUGINS_WORKSPACES_DATE_TIME_FORMAT_WITH_YEAR}}") : momentDate.format(PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N ? PLUGINS_WORKSPACES_APPLICATIONV2_WORKSPACES_I18N.PLUGINS_WORKSPACES_DATE_FORMAT_WITH_YEAR : "{{i18n plugin.workspaces:PLUGINS_WORKSPACES_DATE_FORMAT_WITH_YEAR}}");
      }
    },

    /**
     * Remove special languages characters to allow easy comparison
     * @param {String} s The string to deemphasize
     * @return {String} The modified string
     */
    deemphasize: function(s)
    {
        if (!s) return s;

        s = s.replace(new RegExp(/[ÀÁÂÃÄÅ]/g),"A");
        s = s.replace(new RegExp(/[àáâãäå]/g),"a");
        s = s.replace(new RegExp(/Æ/g),"AE");
        s = s.replace(new RegExp(/æ/g),"ae");
        s = s.replace(new RegExp(/Ç/g),"C");
        s = s.replace(new RegExp(/ç/g),"c");
        s = s.replace(new RegExp(/[ÈÉÊË]/g),"E");
        s = s.replace(new RegExp(/[èéêë]/g),"e");
        s = s.replace(new RegExp(/[ÌÍÎÏ]/g),"I");
        s = s.replace(new RegExp(/[ìíîï]/g),"i");
        s = s.replace(new RegExp(/Ñ/g),"N");
        s = s.replace(new RegExp(/ñ/g),"n");
        s = s.replace(new RegExp(/[ÒÓÔÕÖ]/g),"O");
        s = s.replace(new RegExp(/[òóôõö]/g),"o");
        s = s.replace(new RegExp(/Œ/g),"OE");
        s = s.replace(new RegExp(/œ/g),"oe");
        s = s.replace(new RegExp(/[ÙÚÛÜ]/g),"U");
        s = s.replace(new RegExp(/[ùúûü]/g),"u");
        s = s.replace(new RegExp(/[ÝŸ]/g),"y");
        s = s.replace(new RegExp(/[ýÿ]/g),"y");

        return s;
    },

    /**
     * Return the color associated to this tag
     * @param {Object} tag the tag object
     * @return {String} the color's name
     */
    tagColor: function(tag)
    {
        if (tag.color)
        {
            return tag.color;
        }
        else
        {
            var s = tag.text;
            var hash = 0;
            for (var i = 0; s && i < s.length; i++)
            {
               hash += s.charCodeAt(i);
            }
            return this.COLORS[hash % this.COLORS.length];
        }
    },

    /**
     * True if is a touch device
     * @return {Boolean} true if is a touch device
     */
    isTouchDevice: function()
    {
        if (window.membresIsTouchDevice === undefined)
        {
            // We can cache this value since in won't change in real life
            // And even, in Chrome emulator, the value only reflects the startup conf
            window.membresIsTouchDevice = (('ontouchstart' in window) ||
                (window.navigator.maxTouchPoints > 0) ||
                (window.navigator.msMaxTouchPoints > 0));
        }
        return window.membresIsTouchDevice;
    },
  }
}
</script>
