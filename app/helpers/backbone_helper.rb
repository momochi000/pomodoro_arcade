module BackboneHelper
  def render_backbone_templates
    templates = get_all_backbone_templates
    render :partial => 'layouts/backbone_templates/pomodoro_arcade_templates', :locals => {templates: templates}
  end

  private

  def get_all_backbone_templates
    Dir[File.join(%w(app views backbone_templates ** *.html.erb))]
  end
end
