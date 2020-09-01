//Handler Bar helpers
const moment = require("moment");

module.exports = {
  // For storie date format when story is created
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  // For the text area, this reduces the amount of text shown and adds ...
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  // To remove the p tags shown in the text area
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  // To add an edit icon to the user logged in story.
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
  // Allows handlebars to pre-populate if set to public it will be public, if private it will be private.
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
