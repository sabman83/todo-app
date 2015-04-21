var app = app || {};

app.TodoView = Backbone.View.extend({

	tagName: 'li',
	
	template: _.template( $('#item-template').html() ),


	events: {
		'click .toggle': 'toggle',
		'dblclick label': 'edit',
		'keypress .edit': 'updateTitle',
		'blur .edit': 'close',
		'click .destroy': 'clear'
	},

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	render: function(){
		this.$el.html(this.template(this.model.attributes));

		this.$el.toggleClass( 'completed', this.model.get('completed') );
		this.toggleVisible();

		this.$input = this.$('.edit');
		
		return this;
	},

	toggle: function() {
		this.model.toggle();
	},

	toggleVisible: function() {
		this.$el.toggleClass( 'hidden', this.isHidden());
	},
	
	isHidden: function() {
		var isCompleted = this.model.get('completed');
		
		return( (!isCompleted && app.TodoFilter === 'completed') ||
						(isCompleted && app.TodoFilter === 'active') );
	},
	

	edit: function(){
		this.$el.addClass('editing');
		this.$input.focus();
	},

	close: function(){
		this.$el.removeClass('editing');
		var title = this.$input.val().trim();
		if( title ) {
			this.model.save({title:title});
		} else {
			this.clear();
		}
		this.$el.removeClass('editing');
	},

	clear: function() {
		this.model.destroy();
	},

	//this might be a bug where a user enters an empty title and the model is not updated
	//TODO
	updateTitle: function(event) {
		if( event.which !== ENTER_KEY ) return;

		this.close();
	}

});
