module ApplicationHelper
  def nav_link(link_text, link_path, controller = nil)
    class_name = params[:controller] == controller ? 'active' : ''
    content_tag(:li, class: class_name) do
      link_to link_text, link_path
    end
  end


end
