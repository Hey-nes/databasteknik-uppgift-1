import mongoose, { connect } from "mongoose";
import readline from "readline";

async function run() {
  await connect("mongodb://localhost:27017/sebastian-inlämning-1");

  const { db } = mongoose.connection;

  const movieSchema = mongoose.Schema({
    title: String,
    director: String,
    releaseYear: Number,
    genres: Array,
    ratings: Array,
    cast: Array,
  });

  const movieModel = mongoose.model("movies", movieSchema);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const updateMovie = async () => {
    rl.question(
      "Enter the title of the movie you want to update: ",
      async (title) => {
        try {
          const movieToUpdate = await movieModel.findOne({ title: title });
          if (!movieToUpdate) {
            console.log("Movie not found.");
            app();
            return;
          }
          console.log("Found movie to update:", movieToUpdate);
          rl.question(
            "Enter the new title of the movie: ",
            async (newTitle) => {
              rl.question(
                "Enter the new director of the movie: ",
                async (newDirector) => {
                  rl.question(
                    "Enter the new release year of the movie: ",
                    async (newReleaseYear) => {
                      rl.question(
                        "Enter the new genre of the movie. If more than one genre separate by comma: ",
                        async (newGenresInput) => {
                          const newGenres = newGenresInput
                            .split(",")
                            .map((genre) => genre.trim());
                          rl.question(
                            "Enter the new rating of the movie. If more than one rating separate by comma: ",
                            async (newRatingsInput) => {
                              const newRatings = newRatingsInput
                                .split(",")
                                .map((rating) => parseFloat(rating.trim()));
                              rl.question(
                                "Enter the new cast of the movie. If more than one actor separate by comma: ",
                                async (newCastInput) => {
                                  const newCast = newCastInput
                                    .split(",")
                                    .map((actor) => actor.trim());

                                  movieToUpdate.title = newTitle;
                                  movieToUpdate.director = newDirector;
                                  movieToUpdate.releaseYear =
                                    parseInt(newReleaseYear);
                                  movieToUpdate.genres = newGenres;
                                  movieToUpdate.ratings = newRatings;
                                  movieToUpdate.cast = newCast;

                                  await movieToUpdate.save();

                                  console.log(
                                    "Movie updated successfully:",
                                    movieToUpdate
                                  );
                                  app();
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        } catch (error) {
          console.error("Error updating movie:", error);
          app();
        }
      }
    );
  };

  const deleteMovie = async () => {
    rl.question(
      "Enter the title of the movie you want to delete: ",
      async (title) => {
        try {
          const movieToDelete = await movieModel.findOne({ title: title });
          if (!movieToDelete) {
            console.log("Movie not found.");
            app();
            return;
          }

          await movieToDelete.deleteOne();

          console.log(`${title} deleted successfully.`);
          app();
        } catch (error) {
          console.error("Error deleting movie: ", error);
          app();
        }
      }
    );
  };

  const app = () => {
    console.log("Menu:");
    console.log("1. View all movies");
    console.log("2. Add a new movie");
    console.log("3. Update a movie");
    console.log("4. Delete a movie");
    console.log("5. Exit");
    rl.question("Make a choice by entering a number: ", (input) => {
      switch (parseInt(input)) {
        case 1:
          movieModel
            .find({})
            .then((movies) => {
              console.log("Movies:");
              console.log(movies);
              app();
            })
            .catch((error) => {
              console.error("Error retrieving movies:", error);
              app();
            });
          break;
        case 2:
          rl.question("Enter the title of the new movie: ", (title) => {
            rl.question("Enter the director of the new movie: ", (director) => {
              rl.question(
                "Enter the release year of the new movie: ",
                (releaseYear) => {
                  rl.question(
                    "Enter the genre of the new movie. If more than one genre separate by comma: ",
                    (genresInput) => {
                      const genres = genresInput
                        .split(",")
                        .map((genre) => genre.trim());
                      rl.question(
                        "Enter the rating of the new movie. If more than one rating separate by comma: ",
                        (ratingsInput) => {
                          const ratings = ratingsInput
                            .split(",")
                            .map((rating) => parseFloat(rating.trim()));
                          rl.question(
                            "Enter the cast of the new movie. If more than one actor separate by comma: ",
                            (castInput) => {
                              const cast = castInput
                                .split(",")
                                .map((actor) => actor.trim());

                              const newMovie = new movieModel({
                                title: title,
                                director: director,
                                releaseYear: parseInt(releaseYear),
                                genres: genres,
                                ratings: ratings,
                                cast: cast,
                              });

                              newMovie
                                .save()
                                .then((savedMovie) => {
                                  console.log("New movie added successfully:");
                                  console.log(savedMovie);
                                  app();
                                })
                                .catch((error) => {
                                  console.error(
                                    "Error adding new movie:",
                                    error
                                  );
                                  app();
                                });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            });
          });
          break;
        case 3:
          updateMovie();
          app();
          break;
        case 4:
          deleteMovie();
          app();
          break;
        case 5:
          console.log("Thank you for using my program.");
          rl.close();
          process.exit(0);
          break;
      }
    });
  };

  app();
}

run();
