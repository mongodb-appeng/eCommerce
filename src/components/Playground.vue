<template>
<div>
<header>
    <section class="hero is-primary is-small">
    <div class="hero-head">
        <nav class="navbar">
        <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <img src="https://bulma.io/images/bulma-type-white.png" alt="Logo">
                </a>
                <span class="navbar-burger burger" data-target="navbarMenuHeroB">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
            <div id="navbarMenuHeroB" class="navbar-menu">
            <div class="navbar-end">
                <a class="navbar-item is-active">
                Home
                </a>
                <a class="navbar-item">
                Examples
                </a>
                <a class="navbar-item">
                Documentation
                </a>
                <span class="navbar-item">
                <a class="button is-info is-inverted">
                    <span class="icon">
                    <i class="fab fa-github"></i>
                    </span>
                    <span>Download</span>
                </a>
                </span>
            </div>
            </div>
        </div>
        </nav>
    </div>

    <div class="hero-body">
        <div class="container has-text-centered">
        <p class="title">
            MongoDB Store
        </p>
        <p class="subtitle">
            Get it while it's hot!
        </p>
        </div>
    </div>

    <div class="hero-foot">
        <nav class="tabs is-boxed is-fullwidth">
        <div class="container">
            <ul>
            <li class="is-active">
                <a>Overview</a>
            </li>
            <li>
                <a>Modifiers</a>
            </li>
            <li>
                <a>Grid</a>
            </li>
            <li>
                <a>Elements</a>
            </li>
            <li>
                <a>Components</a>
            </li>
            <li>
                <a>Layout</a>
            </li>
            </ul>
        </div>
        </nav>
    </div>
    </section>
</header>
<body>
    <section>
        <div class="container is-widescreen">
            <div class="notification">
                This container is <strong>fullwidth</strong> <em>until</em> the <code>$widescreen</code> breakpoint.
            </div>
        </div>
    </section>
    
    <div class="container">
        <!-- Main container -->
        <nav class="level">
        <!-- Left side -->
        <div class="level-left">
            <div class="level-item">
            <p class="subtitle is-5">
                <strong>123</strong> posts
            </p>
            </div>
            <div class="level-item">
            <div class="field has-addons">
                <p class="control">
                <input class="input" type="text" placeholder="Find a post">
                </p>
                <p class="control">
                <button class="button">
                    Search
                </button>
                </p>
            </div>
            </div>
        </div>
        <!-- Right side -->
        <div class="level-right">
            <p class="level-item"><strong>All</strong></p>
            <p class="level-item"><a>Published</a></p>
            <p class="level-item"><a>Drafts</a></p>
            <p class="level-item"><a>Deleted</a></p>
            <p class="level-item"><a class="button is-success">New</a></p>
        </div>
        </nav>
        <nav class="level">
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Tweets</p>
                <p class="title">3,456</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Following</p>
                <p class="title">123</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Followers</p>
                <p class="title">456K</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Likes</p>
                <p class="title">789</p>
                </div>
            </div>
        </nav>
        <nav class="level is-mobile">
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Tweets</p>
                <p class="title">3,456</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Following</p>
                <p class="title">123</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Followers</p>
                <p class="title">456K</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                <p class="heading">Likes</p>
                <p class="title">789</p>
                </div>
            </div>
        </nav>

        <article class="media">
            <figure class="media-left">
                <p class="image is-64x64">
                <img src="https://bulma.io/images/placeholders/128x128.png">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                <p>
                    <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
                    <br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
                </p>
                </div>
                <nav class="level is-mobile">
                <div class="level-left">
                    <a class="level-item">
                    <span class="icon is-small"><i class="fas fa-reply"></i></span>
                    </a>
                    <a class="level-item">
                    <span class="icon is-small"><i class="fas fa-retweet"></i></span>
                    </a>
                    <a class="level-item">
                    <span class="icon is-small"><i class="fas fa-heart"></i></span>
                    </a>
                </div>
                </nav>
            </div>
            <div class="media-right">
                <button class="delete"></button>
            </div>
        </article>

        <article class="media">
            <figure class="media-left">
                <p class="image is-64x64">
                <img src="https://bulma.io/images/placeholders/128x128.png">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                <p>
                    <strong>Barbara Middleton</strong>
                    <br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta eros lacus, nec ultricies elit blandit non. Suspendisse pellentesque mauris sit amet dolor blandit rutrum. Nunc in tempus turpis.
                    <br>
                    <small><a>Like</a> · <a>Reply</a> · 3 hrs</small>
                </p>
                </div>

                <article class="media">
                <figure class="media-left">
                    <p class="image is-48x48">
                    <img src="https://bulma.io/images/placeholders/96x96.png">
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                    <p>
                        <strong>Sean Brown</strong>
                        <br>
                        Donec sollicitudin urna eget eros malesuada sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam blandit nisl a nulla sagittis, a lobortis leo feugiat.
                        <br>
                        <small><a>Like</a> · <a>Reply</a> · 2 hrs</small>
                    </p>
                    </div>

                    <article class="media">
                    Vivamus quis semper metus, non tincidunt dolor. Vivamus in mi eu lorem cursus ullamcorper sit amet nec massa.
                    </article>

                    <article class="media">
                    Morbi vitae diam et purus tincidunt porttitor vel vitae augue. Praesent malesuada metus sed pharetra euismod. Cras tellus odio, tincidunt iaculis diam non, porta aliquet tortor.
                    </article>
                </div>
            </article>

            <article class="media">
            <figure class="media-left">
                <p class="image is-48x48">
                <img src="https://bulma.io/images/placeholders/96x96.png">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                <p>
                    <strong>Kayli Eunice </strong>
                    <br>
                    Sed convallis scelerisque mauris, non pulvinar nunc mattis vel. Maecenas varius felis sit amet magna vestibulum euismod malesuada cursus libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus lacinia non nisl id feugiat.
                    <br>
                    <small><a>Like</a> · <a>Reply</a> · 2 hrs</small>
                </p>
                </div>
            </div>
            </article>
        </div>
        </article>
        <article class="media">
        <figure class="media-left">
            <p class="image is-64x64">
            <img src="https://bulma.io/images/placeholders/128x128.png">
            </p>
        </figure>
        <div class="media-content">
            <div class="field">
            <p class="control">
                <textarea class="textarea" placeholder="Add a comment..."></textarea>
            </p>
            </div>
            <div class="field">
            <p class="control">
                <button class="button">Post comment</button>
            </p>
            </div>
        </div>
        </article>

        <div class="tile is-ancestor">
        <div class="tile is-vertical is-8">
            <div class="tile">
            <div class="tile is-parent is-vertical">
                <article class="tile is-child notification is-primary">
                <p class="title">Vertical...</p>
                <p class="subtitle">Top tile</p>
                </article>
                <article class="tile is-child notification is-warning">
                <p class="title">...tiles</p>
                <p class="subtitle">Bottom tile</p>
                </article>
            </div>
            <div class="tile is-parent">
                <article class="tile is-child notification is-info">
                <p class="title">Middle tile</p>
                <p class="subtitle">With an image</p>
                <figure class="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/640x480.png">
                </figure>
                </article>
            </div>
            </div>
            <div class="tile is-parent">
            <article class="tile is-child notification is-danger">
                <p class="title">Wide tile</p>
                <p class="subtitle">Aligned with the right tile</p>
                <div class="content">
                <!-- Content -->
                </div>
            </article>
            </div>
        </div>
        <div class="tile is-parent">
            <article class="tile is-child notification is-success">
            <div class="content">
                <p class="title">Tall tile</p>
                <p class="subtitle">With even more content</p>
                <div class="content">
                <!-- Content -->
                </div>
            </div>
            </article>
        </div>
        </div>

    </div>

</body>
</div>
</template>

<script>

export default {
    name: "Playgrounf",
    // props: ["stitchClient"], 
    data() {
        return {

        }
    },
  created() {

  }
}
</script>
