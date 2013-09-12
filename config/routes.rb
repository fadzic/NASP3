NASP3::Application.routes.draw do
  root to: 'home#index'

  match '/binary_tree' => 'binary_tree#show'

  match '/rb_tree' => 'rb_tree#show'

  match '/heap_tree' => 'heap_tree#show'

  match '/avl_tree' => 'avl_tree#show'
end
