namespace :deploy do
  task :production do
    sh "git push heroku master"
    sh "heroku run rake db:migrate"
  end
end
