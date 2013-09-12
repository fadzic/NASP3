NASP3::Application.routes.draw do
  root to: 'home#index'

  namespace :binary_tree do
    root to: 'binary_tree#show'
  end

  match '/rb_tree' => 'rb_tree#show'

  match '/heap_tree' => 'heap_tree#show'

  match '/avl_tree' => 'avl_tree#show'
end
