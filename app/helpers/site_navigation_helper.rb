module SiteNavigationHelper
  def timer_nav_item
    css_class = ( (request.original_url == timers_url) ? 'active' : '')
    content_tag(:li, :class => css_class) do
      link_to 'Timers', timers_path
    end
  end

  def progress_nav_item
    render :partial => '/navigation/progress_nav_item'
  end
end
