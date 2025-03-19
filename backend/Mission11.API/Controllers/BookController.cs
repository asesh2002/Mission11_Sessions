using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;

namespace Mission11.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private BookDbContext _bookcontext;   
    
    public BookController(BookDbContext temp) => _bookcontext = temp;

    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageSize = 10, int pageNum = 1,  string sortBy = "Title", bool descending = false)
    {
        IQueryable<Book> query = _bookcontext.Books;

        sortBy = sortBy.ToLower();
        // Apply Sorting Based on User Input
        query = sortBy switch
        {
            "title" => descending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title),
            _ => query.OrderBy(b => b.Title) // Default: Sort by title if no valid sortBy provided
        };

        var display = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var totalBooks = _bookcontext.Books.Count();

        return Ok(new
        {
            Books = display,
            TotalNumBooks = totalBooks
        });
    }
}
